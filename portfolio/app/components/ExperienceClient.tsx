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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Education Section */}
          <div className="mb-12 sm:mb-16 lg:mb-24">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Education
              </h2>
              <div className="w-20 sm:w-24 lg:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mx-auto rounded-full shadow-lg"></div>
            </div>
  
            <div className="relative">
              {/* Professional vertical timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-600 rounded-full"></div>
  
              <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                {educationData.map((item, idx) => {
                  const colors = getColorClasses(item.color);
                  return (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 sm:border-3 lg:border-4 border-white shadow-lg z-10 ${colors.dot} dark:border-gray-800 group-hover:scale-110 transition-transform duration-300`}
                    ></div>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block ml-8 sm:ml-10 lg:ml-12 p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-blue-200 dark:group-hover:border-blue-800 cursor-pointer"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
                          <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 p-1 sm:p-2 shadow-md group-hover:bg-gray-100 transition-colors duration-200">
                              <img
                                src={item.logoUrl}
                                alt={`${item.title} logo`}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-4 lg:mt-0 lg:ml-6">
                            <span
                              className={`inline-flex items-center justify-center w-44 sm:w-48 lg:w-52 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md ${colors.bgLight} ${colors.bgDark} ${colors.text} ${colors.textDark}`}
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {item.period}
                            </span>
                          </div>
                        </div>
                        {/* External Link Icon */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </a>
                    ) : (
                      <div className="ml-8 sm:ml-10 lg:ml-12 p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
                          <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 p-1 sm:p-2 shadow-md">
                              <img
                                src={item.logoUrl}
                                alt={`${item.title} logo`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-4 lg:mt-0 lg:ml-6">
                            <span
                              className={`inline-flex items-center justify-center w-44 sm:w-48 lg:w-52 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md ${colors.bgLight} ${colors.bgDark} ${colors.text} ${colors.textDark}`}
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {item.period}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                   );
                 })}
              </div>
            </div>
          </div>
  
          {/* Experience Section */}
          <div>
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Experience
              </h2>
              <div className="w-20 sm:w-24 lg:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mx-auto rounded-full shadow-lg"></div>
            </div>

            {experienceData.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {experienceData.map((item, index) => (
                  <div
                    key={item._id}
                    className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                     {item.url ? (
                       <a
                         href={item.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer h-full flex flex-col"
                       >
                        {/* Header with Logo and Organization */}
                        <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors duration-200 shadow-md">
                            <img
                              src={item.logoUrl}
                              alt={`${item.organization} logo`}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1 sm:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600 dark:text-gray-400 truncate">
                              {item.organization}
                            </p>
                          </div>
                        </div>
                        
                         {/* Period Badge */}
                         <div className="mb-4 sm:mb-6 flex justify-start">
                           <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {item.period}
                          </span>
                        </div>
                        
                        {/* Description */}
                         <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed flex-1">
                          {item.description}
                        </p>
                        
                        {/* External Link Icon */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        
                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </a>
                     ) : (
                       <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 shadow-lg border border-gray-100 dark:border-gray-800 h-full flex flex-col">
                        {/* Header with Logo and Organization */}
                        <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 shadow-md">
                            <img
                              src={item.logoUrl}
                              alt={`${item.organization} logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1 sm:mb-2">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600 dark:text-gray-400 truncate">
                              {item.organization}
                            </p>
                          </div>
                        </div>
                        
                         {/* Period Badge */}
                         <div className="mb-4 sm:mb-6 flex justify-start">
                           <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {item.period}
                          </span>
                        </div>
                        
                        {/* Description */}
                         <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed flex-1">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 lg:py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400"
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
                <h3 className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                  Building My Experience
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                  Currently focused on education and personal projects. Professional
                  experience coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
  );
}
