import Image from "next/image";
import { ProjectsCard } from "../lib/interface";
import { client } from "../lib/sanity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

async function getData() {
  const query = `*[_type == 'project'] | order(orderRank asc) {
        title,
          _id,
          link,
          description,
          tags,
          "imageUrl": image.asset->url
        
    }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });

  return data;
}


export default async function ProjectsPage() {
  const data: ProjectsCard[] = await getData();
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-16 relative">
        <h1 className="font-display text-5xl lg:text-6xl mb-6 text-slate-950 dark:text-white animate-in fade-in slide-in-from-top-6 duration-1000 ease-out" style={{
          lineHeight: '1.4',
          letterSpacing: '-0.02em'
        }}>
          Featured Projects
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
          Selected builds across web applications, AI workflows, and interactive systems.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 grid-cols-1">
        {data.map((item) => (
          <a
            href={item.link}
            key={item._id}
            className="group block bg-white dark:bg-gray-900 rounded-xl p-6 transition-colors duration-300 border border-gray-200 dark:border-gray-800 hover:border-primary/40 dark:hover:border-primary/50"
            target="_blank"
          >
            <div className="aspect-[2/1] overflow-hidden rounded-lg relative mb-6 bg-slate-100 dark:bg-slate-800">
              <Image
                src={item.imageUrl}
                alt={item.title || "Project Image"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-lg"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map((tagItem, index) => (
                  <span
                    className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    key={index}
                  >
                    {tagItem}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
