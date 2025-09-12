import Image from "next/image";
import profile from "../../public/profile.jpg";
import { Card, CardContent } from "@/components/ui/card";

export function Intro() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 lg:p-8">
      <Image
        src={profile}
        alt="Shen Haoming"
        className="col-span-1 lg:col-span-1 h-[300px] lg:h-[500px] object-cover rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50 order-1 lg:order-2"
        priority
      />
      <Card className="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 min-h-[400px] lg:min-h-[300px] border border-blue-200/50 dark:border-blue-700/50 order-2 lg:order-1">
        <CardContent className="p-6 lg:p-8">
          <div className="max-w-lg">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent" style={{
              lineHeight: '1.4',
              letterSpacing: '-0.03em'
            }}>
              Shen Haoming
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold mt-6 text-gray-800 dark:text-gray-200">
              Software Developer
            </h2>
            <p className="text-lg lg:text-xl font-normal mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            Passionate about building innovative software with modern web technologies and applying them to solve real-world problems.
            </p>

          <a
            href="mailto:lbb54188@gmail.com"
            className="relative inline-block text-lg group mt-10"
          >
            <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300 ease-out border-2 border-blue-600 dark:border-blue-400 rounded-lg group-hover:text-white dark:group-hover:text-gray-900 bg-white dark:bg-gray-900">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
              <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:-rotate-180 ease"></span>
              <span className="relative z-20">Get in Touch!</span>
            </span>
            <span
              className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:mb-0 group-hover:mr-0"
              data-rounded="rounded-lg"
            ></span>
          </a>
          
          <div className="flex gap-4 mt-6">
            <a
              href="https://www.linkedin.com/in/shen-haoming/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-105 hover:-translate-y-0.5 group"
            >
              <Image
                src="/linkedin.png"
                alt="LinkedIn"
                width={30}
                height={30}
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
              />
              LinkedIn
            </a>
            
            <a
              href="https://github.com/Haoming9527"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-105 hover:-translate-y-0.5 group"
            >
              <Image
                src="/github_light.png"
                alt="GitHub"
                width={20}
                height={20}
                className="w-5 h-5 dark:hidden group-hover:scale-110 transition-transform duration-200"
              />
              <Image
                src="/github_dark.png"
                alt="GitHub"
                width={20}
                height={20}
                className="w-5 h-5 hidden dark:block group-hover:scale-110 transition-transform duration-200"
              />
              GitHub
            </a>
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}