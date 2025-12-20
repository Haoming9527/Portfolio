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
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold lg:text-6xl mb-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-700" style={{
          lineHeight: '1.4',
          letterSpacing: '-0.02em'
        }}>
          Featured Projects
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
          Explore my latest work showcasing innovative solutions and creative problem-solving
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 grid-cols-1">
        {data.map((item, index) => (
          <a
            href={item.link}
            key={item._id}
            className="group block bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 150}ms` }}
            target="_blank"
          >
            <div className="aspect-[2/1] overflow-hidden rounded-2xl relative mb-6">
              <Image
                src={item.imageUrl}
                alt={item.title || "Project Image"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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
                    className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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

