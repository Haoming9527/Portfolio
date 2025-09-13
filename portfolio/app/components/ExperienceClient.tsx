import { Education, Experience as ExperienceType } from "../lib/interface";

interface ExperienceProps {
  educationData: Education[];
  experienceData: ExperienceType[];
}

// Color mapping function to handle dynamic Tailwind classes
function getColorClasses(color: string) {
  const colorMap: { [key: string]: { 
    dot: string; 
    text: string; 
    bgLight: string; 
    bgDark: string; 
    textDark: string; 
  } } = {
    blue: {
      dot: "bg-blue-600",
      text: "text-blue-600",
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-900/20",
      textDark: "dark:text-blue-400"
    },
    purple: {
      dot: "bg-purple-600",
      text: "text-purple-600",
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-900/20",
      textDark: "dark:text-purple-400"
    },
    indigo: {
      dot: "bg-indigo-600",
      text: "text-indigo-600",
      bgLight: "bg-indigo-50",
      bgDark: "dark:bg-indigo-900/20",
      textDark: "dark:text-indigo-400"
    },
    green: {
      dot: "bg-green-600",
      text: "text-green-600",
      bgLight: "bg-green-50",
      bgDark: "dark:bg-green-900/20",
      textDark: "dark:text-green-400"
    },
    red: {
      dot: "bg-red-600",
      text: "text-red-600",
      bgLight: "bg-red-50",
      bgDark: "dark:bg-red-900/20",
      textDark: "dark:text-red-400"
    },
    orange: {
      dot: "bg-orange-600",
      text: "text-orange-600",
      bgLight: "bg-orange-50",
      bgDark: "dark:bg-orange-900/20",
      textDark: "dark:text-orange-400"
    }
  };
  
  return colorMap[color] || colorMap.blue; // fallback to blue if color not found
}

export function ExperienceClient({ educationData, experienceData }: ExperienceProps) {
  return (
    <div className="max-w-4xl mx-auto">
          {/* Education Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Education
            </h2>
  
            <div className="relative">
              {/* Dynamic vertical timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-600"></div>
  
              <div className="space-y-8">
                {educationData.map((item, idx) => {
                  const colors = getColorClasses(item.color);
                  return (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg z-10 ${colors.dot} dark:border-gray-800`}
                    ></div>
                    <div className="ml-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center gap-4">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 p-1 hover:bg-gray-100 transition-colors duration-200 group"
                            >
                              <img
                                src={item.logoUrl}
                                alt={`${item.title} logo`}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                              />
                            </a>
                          ) : (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 p-1">
                              <img
                                src={item.logoUrl}
                                alt={`${item.title} logo`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full mt-3 sm:mt-0 ${colors.bgLight} ${colors.bgDark} ${colors.text} ${colors.textDark}`}
                        >
                          {item.period}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                   );
                 })}
              </div>
            </div>
          </div>
  
          {/* Experience Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Experience
            </h2>

            {experienceData.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 grid-cols-1">
                {experienceData.map((item, index) => (
                  <div
                    key={item._id}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-4 mb-3">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
                          >
                            <img
                              src={item.logoUrl}
                              alt={`${item.organization} logo`}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                          </a>
                        ) : (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                            <img
                              src={item.logoUrl}
                              alt={`${item.organization} logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {item.organization}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                        {item.period}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2-2V8a2 2 0 012-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Building My Experience
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Currently focused on education and personal projects. Professional
                  experience coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
  );
}
