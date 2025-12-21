import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Shen Haoming
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Software Developer
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/shen-haoming/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Image
                  src="/linkedin.png"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                  className="hover:scale-110 transition-transform duration-200"
                />
              </a>
              <a
                href="https://github.com/Haoming9527"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Image
                  src="/github_light.png"
                  alt="GitHub"
                  width={24}
                  height={24}
                  className="hover:scale-110 transition-transform duration-200 dark:hidden"
                />
                <Image
                  src="/github_dark.png"
                  alt="GitHub"
                  width={24}
                  height={24}
                  className="hover:scale-110 transition-transform duration-200 hidden dark:block"
                />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contact
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                lbb54188@gmail.com
              </p>
              <p className="text-gray-600 dark:text-gray-300">+65 8761 3426</p>
              <p className="text-gray-600 dark:text-gray-300">Singapore</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Built with
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Next.js", url: "https://nextjs.org" },
                { name: "Tailwind", url: "https://tailwindcss.com" },
                { name: "TypeScript", url: "https://www.typescriptlang.org" },
              ].map((tech) => (
                <a
                  key={tech.name}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer"
                >
                  {tech.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-sm"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-sm"
              >
                Projects
              </Link>
              <Link
                href="/experience"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-sm"
              >
                Experience
              </Link>
              <Link
                href="/certificates"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-sm"
              >
                Certificates
              </Link>
              <Link
                href="/guestbook"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-sm col-span-2"
              >
                Guestbook
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} Shen Haoming. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
