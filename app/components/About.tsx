import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function About() {
  return (
    <div className="mt-12 lg:mt-16">
      <div className="flex justify-center mb-12">
        <div className="h-px w-full max-w-5xl bg-border"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 lg:p-8">
        <Card className="lg:col-span-3 shadow-none">
          <CardHeader>
            <CardTitle className="font-display text-4xl lg:text-5xl text-center text-slate-950 dark:text-white text-balance">
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Hello, I am Haoming. I build web applications and intelligent systems with a full-stack foundation and a curiosity for how complex tools become understandable.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              My current focus is AI engineering and agentic systems: turning models, workflows, data, and interfaces into software people can actually use.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What I Do</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                  <li>- Full-stack web application development</li>
                  <li>- Responsive, high-fidelity UI implementation</li>
                  <li>- APIs and systems around AI workflows</li>
                  <li>- Database management and service integration</li>
                </ul>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-900/60">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">My Interests</h3>
                <ul className="text-emerald-950/80 dark:text-emerald-100/80 space-y-2">
                  <li>- Agentic engineering and intelligent AI apps</li>
                  <li>- New full-stack technologies and frameworks</li>
                  <li>- Collaborative problem-solving</li>
                  <li>- Practical systems for real-world workflows</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
