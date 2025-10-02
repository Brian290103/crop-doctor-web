import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Brain, FileStack, BarChart, Database } from 'lucide-react';

const adminFeatures = [
    {
        name: "Train the AI",
        description: "Add new crops and their associated diseases to the AI's knowledge base.",
        icon: Brain
    },
    {
        name: "Manage Sources",
        description: "Upload new documents, research papers, and articles to expand the AI's training data.",
        icon: FileStack
    },
    {
        name: "Monitor Performance",
        description: "Review the AI's conversations and diagnoses to ensure accuracy and identify areas for improvement.",
        icon: BarChart
    },
    {
        name: "Embed Content",
        description: "Process and embed new information to make it searchable for the AI.",
        icon: Database
    }
];

export function AdminSection() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-green-600">For Admins & Researchers</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The Crop Doctor Web Portal</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                This website is the central hub for managing and training the Crop Doctor AI. As an administrator or researcher, you have the tools to continuously improve the AI's knowledge and capabilities, ensuring farmers receive the most accurate and up-to-date information.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {adminFeatures.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-green-600" aria-hidden="true" />
                      {feature.name}
                    </dt>
                    <dd className="mt-2">{feature.description}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10">
                <Link href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <Image
              src="https://img.freepik.com/free-photo/young-female-farmer-working-field-checking-plants_1150-7139.jpg?t=st=1759402852~exp=1759406452~hmac=de3beaf1c4e7ab28f9562c80f11674730bba4c25d7573a8b399e661138b4d69f&w=1060"
              alt="Admin dashboard screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </div>
  );
}