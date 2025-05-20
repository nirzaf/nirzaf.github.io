import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaMobileAlt, FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'About - M.F.M Fazrin',
  description: 'Software Development Specialist with expertise in .NET, Angular, and Azure Cloud Services',
  alternates: {
    canonical: '/about',
  }
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors duration-300">
          {/* Header Section */}
          <div className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-4">
              <Image 
                src="https://ik.imagekit.io/fazrinphcc/myprofilepic%20-%20crpped.jpg?updatedAt=1725949317901" 
                alt="Profile Picture" 
                width={150} 
                height={150} 
                className="rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">About</h1>
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">M.F.M Fazrin</h2>
            <h2 className="text-xl text-blue-600 dark:text-blue-400 mb-4">MSc in Software Engineering</h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>Al Sadd, Doha, Qatar</span>
              </div>
              <div className="flex items-center">
                <FaMobileAlt className="mr-2" />
                <span>+97433253203</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-2" />
                <span>+94772049123</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>mfmfazrin1986@gmail.com</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-blue-600 dark:text-blue-400">
              
              <Link 
                href="https://github.com/nirzaf" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline"
                aria-label="View my GitHub profile"
              >
                <FaGithub className="mr-2" />
                <span>github.com/nirzaf</span>
              </Link>
              <Link 
                href="https://linkedin.com/in/mfmfazrin" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline"
                aria-label="Connect with me on LinkedIn"
              >
                <FaLinkedin className="mr-2" />
                <span>linkedin.com/in/mfmfazrin</span>
              </Link>
              <Link 
                href="https://nirzaf.github.io" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline"
                aria-label="View my portfolio"
              >
                <FaGlobe className="mr-2" />
                <span>Portfolio</span>
              </Link>
            </div>
            
            <div className="flex justify-center mb-4">
              <Link href="https://www.buymeacoffee.com/fazrinphccs" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                  alt="Buy Me A Coffee" 
                  width={200} 
                  height={60} 
                />
              </Link>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your contribution helps me create more content and improve this blog.
            </p>
          </div>
          
          {/* Contact Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Contact
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Get in touch with me via email or through the contact form below.
            </p>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                As a Senior Software Development Specialist at the Primary Health Care Corporation in
                Qatar, I develop robust, high-concurrency web applications with a strong focus on
                delivering a seamless and positive end-user experience.
              </p>
            </div>
          </div>
          
          {/* Summary Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Summary
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                As a Senior Software Development Specialist at the Primary Health Care Corporation in
                Qatar, I develop robust, high-concurrency web applications with a strong focus on
                delivering a seamless and positive end-user experience.
              </p>
              <p>
                With over a decade of experience in software engineering, I have a proven track record of
                delivering high-quality solutions across diverse industries. My technical proficiency
                spans a wide range of technologies, and I am adept at quickly learning and adapting to new
                challenges.
              </p>
              <p>
                I am seeking a challenging role where I can leverage my expertise and passion for
                innovation to contribute to the development of impactful software.
              </p>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Top Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'C#/.NET Core', 'ASP.NET Core', 'Angular', 'Azure Cloud Services', 'SQL Server',
                'Microservices', 'REST API', 'Agile Methodologies', 'Leadership & Mentoring'
              ].map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {/* Experience Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Work Experience
            </h2>
            
            {/* Job Entry 1 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Software Development Specialist</h3>
              <div className="text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Primary Health Care Corporation (Qatar)</span> | 
                <span className="italic">July 2022 - Present</span>
              </div>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Project: Nar'aakom Mobile Application (Backend Services)</strong></li>
                <li>
                  Migrated REST APIs to GraphQL, integrated Azure Active Directory for authentication,
                  and optimized query performance with Azure Redis caching.
                </li>
                <li>
                  Migrated data from SQL Server to a FHIR (Fast Healthcare Interoperability Resources)
                  database.
                </li>
                <li>Developed an Open API system to allow third-party service integrations.</li>
              </ul>
            </div>
            
            <div className="relative h-2 my-8">
              <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
            </div>
            
            {/* Job Entry 2 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Senior Full-stack Engineer</h3>
              <div className="text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Quadrate Tech Solutions Private Limited</span> | 
                <span className="italic">July 2020 - June 2022</span>
              </div>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Project: Hotel ERP (SaaS-based ERP Solution for hotels)</strong></li>
                <li>
                  Developed and maintained the administration module, handling user authentication,
                  authorization, and configuration of modules.
                </li>
                <li>
                  Deployed a mail service and SMS gateway using Azure Functions and Logic Apps for user
                  communication and third-party integrations.
                </li>
                <li>
                  Increased system scalability by synchronizing legacy data from SQL Server to Cosmos
                  Database using SQL API.
                </li>
                <li>
                  Developed user interfaces using Angular and integrated microservices using Azure
                  Service Bus and RabbitMQ.
                </li>
                <li>Implemented CI/CD pipelines using Azure DevOps.</li>
                <li>
                  Worked with technologies including Service Bus, RabbitMQ, SQL Server 2022, and CI/CD
                  pipeline in Azure DevOps.
                </li>
              </ul>
            </div>
            
            <div className="relative h-2 my-8">
              <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
            </div>
            
            {/* Job Entry 3 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Dot NET Engineer</h3>
              <div className="text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Voigue Private Limited</span> | 
                <span className="italic">Nov 2019 - June 2020</span>
              </div>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Project: SmartPABX - Cloud-Based Phone System</strong></li>
                <li>
                  Developed Backend API with .NET Core and Updated the existing PABX legacy system to
                  the latest version.
                </li>
                <li>
                  User interface optimized completely by converting WinForms to WPF and enabled Dynamic
                  User interface functions such as call forward, group calls, call parking and many
                  other features.
                </li>
                <li>
                  Tools & Technologies Used: .NET Core 2.1, AsterNET, WPF, C# (7), REST API, XAML, PABX
                  Asterisk, MariaDB, Apache Server, JSON, Visual Studio 2019.
                </li>
              </ul>
            </div>
            
            {/* More job entries can be added here */}
          </div>
          
          {/* Education Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Education
            </h2>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">MSc in Software Engineering</h3>
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Kingston University</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">BE in Software Engineering</h3>
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">London Metropolitan University</span>
              </div>
            </div>
          </div>
          
          {/* Other Qualifications Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Other Qualifications
            </h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">International English Language Testing System (IELTS) (Academic)</h3>
              <div className="text-gray-600 dark:text-gray-400">
                <span>7.5 Average</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Microsoft Azure Developer Associate (AZ-204)</h3>
              <div className="text-gray-600 dark:text-gray-400">
                <span>Completed an instructor-led training program on developing solutions using Microsoft Azure cloud platform.</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Udemy - Power Automate</h3>
              <div className="text-gray-600 dark:text-gray-400">
                <span>Completed a course on using Power Automate, a workflow automation tool.</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Udemy - Power Apps</h3>
              <div className="text-gray-600 dark:text-gray-400">
                <span>Completed a course on using Power Apps, a low-code application development platform.</span>
              </div>
            </div>
          </div>
          
          {/* Freelancer Profile Section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <Image 
                src="https://cdn2.f-cdn.com/ppic/259462817/logo/79340852/profile_logo_79340852.jpg" 
                alt="M.F.M Fazrin" 
                width={100} 
                height={100} 
                className="rounded-full border-2 border-gray-300 dark:border-gray-600"
              />
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">M.F.M Fazrin</h3>
                <p className="text-gray-700 dark:text-gray-300">Software Development Specialist</p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>P:</strong> +97433253203 | <strong>M:</strong> +94772049123
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>E:</strong> info@dotnetevangelist.net
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>A:</strong> Al Sadd Street, Doha, Qatar, Doha
                </p>
              </div>        
            </div>
          </div>
        </div>
      </main>
      
      {/* Font Awesome Script */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js" async></script>
    </div>
  );
}
