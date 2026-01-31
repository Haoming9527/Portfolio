import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Technology as TechnologyType } from "../lib/interface";
import { client } from "../lib/sanity";
import DynamicTechScene from "@/components/3d/technology/DynamicTechScene";
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
         <DynamicTechScene />
      </div>
      <div className="flex flex-col w-full col-span-1 lg:col-span-2 gap-4">
        <Card className="bg-gray-100 dark:bg-gray-800 border-none">
          <CardHeader>
            <CardTitle className="text-3xl lg:text-4xl font-bold text-left bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"style={{
          lineHeight: '1.3',
          letterSpacing: '-0.02em'
        }} >Explore My Stack</CardTitle>
            <CardDescription className="text-left text-lg lg:text-xl text-gray-600 dark:text-gray-400">Check out the technologies I use every day</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {technologyData.map((tech: TechnologyType) => (
              <a
                key={tech._id}
                href={tech.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg"
                title={tech.name}
              >
                <Image 
                  src={tech.iconUrl} 
                  alt={tech.name} 
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg transition-transform hover:scale-110 hover:shadow-md" 
                />
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}