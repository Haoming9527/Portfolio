import { ExperienceClient } from "@/app/components/ExperienceClient";
import { client } from "../lib/sanity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
};

async function getEducationData() {
  const query = `*[_type == 'education'] | order(orderRank asc) {
    title,
    _id,
    period,
    description,
    color,
    url,
    logo,
    "logoUrl": logo.asset->url
  }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data;
}

async function getExperienceData() {
  const query = `*[_type == 'experience'] | order(orderRank asc) {
    title,
    _id,
    organization,
    period,
    description,
    url,
    logo,
    "logoUrl": logo.asset->url
  }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data;
}

export default async function ExperiencePage() {
  const [educationData, experienceData] = await Promise.all([
    getEducationData(),
    getExperienceData()
  ]);
  
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-16 relative">
        <h1 className="font-display text-5xl lg:text-6xl mb-4 text-slate-950 dark:text-white animate-in fade-in slide-in-from-top-4 duration-700">
          Experience & Education
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
          The studies, projects, and practical work shaping how I build software.
        </p>
      </div>
      
      <ExperienceClient educationData={educationData} experienceData={experienceData} />
    </div>
  );
}
