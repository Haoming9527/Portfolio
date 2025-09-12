import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function About() {
  return (
    <div className="mt-12 lg:mt-16">
      {/* Decorative divider */}
      <div className="flex justify-center mb-12">
        <div className="w-100 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 lg:p-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-4xl lg:text-5xl font-bold text-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Hello! I am Haoming. I am a software developer with a foundation in modern web technologies. 
            My journey in programming began with curiosity about how things work behind the scenes, 
            and it has evolved into a deep passion for creating efficient, scalable, and user-friendly applications.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            I studied full-stack development and am constantly exploring new fields like 
            AI and cybersecurity to expand my expertise. I enjoy solving complex problems, 
            turning ideas into reality through clean, maintainable code, and collaborating with others 
            to create innovative projects that address real-world challenges while continuously learning along the way.

          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What I Do</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Full-stack web development</li>
                <li>• UI/UX implementation</li>
                <li>• API design and development</li>
                <li>• Database Management</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">My Interests</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Learning new technologies</li>
                <li>• Collaborative team projects</li>
                <li>• Problem-solving challenges</li>
                <li>• Building innovative solutions</li>
              </ul>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
