import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Technology as TechnologyType } from "../lib/interface";
import { client } from "../lib/sanity";
import Image from "next/image";

async function getTechnologyData() {
  const query = `*[_type == 'technology'] | order(orderRank asc) {
    name,
    _id,
    icon,
    "iconUrl": icon.asset->url,
    link
  }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data;
}
export async function Technology() {
  const technologyData = await getTechnologyData();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 lg:p-8 mt-10">
      <div className="w-full relative col-span-1 min-h-[300px] h-full">
        <Image
          src="/stack-workbench.png"
          alt="Abstract system workbench with interface panels and blue-violet nodes"
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover rounded-xl"
          priority
        />
      </div>
      <div className="flex flex-col w-full col-span-1 lg:col-span-2 gap-4">
        <Card className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-none">
          <CardHeader>
            <CardTitle className="font-display text-3xl lg:text-4xl text-left text-slate-950 dark:text-white"style={{
          lineHeight: '1.3',
          letterSpacing: '-0.02em'
        }} >Explore My Stack</CardTitle>
            <CardDescription className="text-left text-lg lg:text-xl text-slate-600 dark:text-slate-300">The tools I reach for when building products, systems, and AI workflows.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {technologyData.map((tech: TechnologyType) => (
              <a
                key={tech._id}
                href={tech.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md transition-colors hover:bg-white dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title={tech.name}
              >
                <Image 
                  src={tech.iconUrl} 
                  alt={tech.name} 
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-md transition-transform duration-200 hover:scale-105" 
                />
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
