import { Certificate } from "../lib/interface";
import { Suspense } from "react";
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
    company,
    orderRank,
    "imageUrl": image.asset->url,
    "dimensions": image.asset->metadata.dimensions
  }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data;
}

export default async function CertificatesPage() {
  const data: Certificate[] = await getData();

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-16 relative">
        <h1 className="font-display text-5xl lg:text-6xl mb-6 text-slate-950 dark:text-white animate-in fade-in slide-in-from-top-4 duration-1000">
          Certificates & Achievements
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
          Credentials from the tools, platforms, and systems I have taken seriously enough to study.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-20 text-gray-500">
            Loading certificates...
          </div>
        }
      >
        <CertificatesClient certificates={data} />
      </Suspense>
    </div>
  );
}
