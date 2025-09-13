import { ExperienceClient } from "@/app/components/ExperienceClient";
import { Education, Experience as ExperienceType } from "../lib/interface";
import { client } from "../lib/sanity";

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
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold lg:text-6xl mb-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-700">
          Experience & Education
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
          My journey through education and professional development
        </p>
      </div>
      
      <ExperienceClient educationData={educationData} experienceData={experienceData} />
    </div>
  );
}
