import { Inter, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderSearch } from "@/components/HeaderSearch";
import { MobileMenu } from "@/components/MobileMenu";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | .NET Evangelist Tech Blogs',
    default: '.NET Evangelist Tech Blogs',
  },
  description: "Exploring modern software development with .NET, web technologies, and cloud solutions",
  keywords: ['.NET', 'C#', 'ASP.NET Core', 'Web Development', 'Software Engineering', 'Cloud Computing', 'Azure', 'Programming', 'Tutorials'],
  authors: [{ name: '.NET Evangelist' }],
  creator: '.NET Evangelist',
  publisher: '.NET Evangelist',
  metadataBase: new URL('https://dotnetevangelist.net'),
  openGraph: {
    title: '.NET Evangelist Tech Blogs',
    description: 'Exploring modern software development with .NET, web technologies, and cloud solutions',
    url: 'https://dotnetevangelist.net',
    siteName: '.NET Evangelist Tech Blogs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '.NET Evangelist Tech Blogs',
    description: 'Exploring modern software development with .NET, web technologies, and cloud solutions',
  },
  alternates: {
    canonical: 'https://dotnetevangelist.net',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <header className="bg-white dark:bg-gray-900 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                <div className="flex items-center">
                  <div className="relative h-12 w-16 md:h-14 md:w-20">
                    <img
                      src="https://ik.imagekit.io/quadrate/assets/img/dotnetevangelist/dotnetlogo.png?updatedAt=1746982028912"
                      alt=".NET Logo"
                      className="object-contain h-full w-full"
                    />
                  </div>
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text ml-1">Evangelist</span>
                </div>
              </Link>
              <div className="flex-1 mx-6 max-w-md hidden md:block">
                <HeaderSearch />
              </div>
              <div className="flex items-center space-x-6">
                <nav className="hidden md:block">
                  <ul className="flex space-x-8">
                    <li>
                      <Link
                        href="/"
                        className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors relative group"
                      >
                        Home
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog"
                        className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors relative group"
                      >
                        Blogs
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors relative group"
                      >
                        About
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/rss.xml"
                        className="text-gray-800 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors relative group"
                        target="_blank"
                      >
                        RSS
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    </li>
                  </ul>
                </nav>

                {/* Mobile menu */}
                <MobileMenu />

                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-white dark:bg-gray-900 py-8 mt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <Link href="/" className="flex items-center hover:opacity-90 transition-opacity mb-4">
                    <div className="flex items-center">
                      <div className="relative h-10 w-14 md:h-12 md:w-16">
                        <img
                          src="https://ik.imagekit.io/quadrate/assets/img/dotnetevangelist/dotnetlogo.png?updatedAt=1746982028912"
                          alt=".NET Logo"
                          className="object-contain h-full w-full"
                        />
                      </div>
                      <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text ml-1">Evangelist</span>
                    </div>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    © 2025 .NET Evangelist. All rights reserved.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-3">Navigation</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                          Blogs
                        </Link>
                      </li>

                      <li>
                        <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                          About
                        </Link>
                      </li>
                      <li>
                        <Link href="/rss.xml" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" target="_blank">
                          RSS Feed
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-3">Connect</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                          Twitter
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                          </svg>
                          LinkedIn
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
