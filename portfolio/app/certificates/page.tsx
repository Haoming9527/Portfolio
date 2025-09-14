import { Certificate } from "../lib/interface";
import { client } from "../lib/sanity";
import CertificatesClient from "../components/CertificatesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates",
};

async function getData() {
  const query = `*[_type == 'certificate'] | order(orderRank asc) {
    title,
    _id,
    description,
    tags,
    "imageUrl": image.asset->url
  }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data;
}

export default async function CertificatesPage() {
  const data: Certificate[] = await getData();
  
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold lg:text-6xl mb-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-700">
          Certificates & Achievements
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
        Certifications and achievements earned throughout my learning journey
        </p>
      </div>
      
      <CertificatesClient certificates={data} />
    </div>
  );
}  
