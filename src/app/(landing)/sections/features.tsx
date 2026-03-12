import { Eye, MessageSquare, BookOpen, ListChecks, GitCompare, Shield } from 'lucide-react';

const features = [
  {
    name: 'Visual Diagnosis',
    description: 'Analyze images to identify crop type, symptoms, and potential diseases.',
    icon: Eye,
  },
  {
    name: 'Text-Based Consultation',
    description: 'Describe symptoms and get a diagnosis directly in the app.',
    icon: MessageSquare,
  },
  {
    name: 'Comprehensive Knowledge Base',
    description: 'Access a vast library of agricultural knowledge, curated by our admin team.',
    icon: BookOpen,
  },
  {
    name: 'Actionable Recommendations',
    description: 'Receive clear, easy-to-follow advice for both organic and chemical treatments.',
    icon: ListChecks,
  },
  {
    name: 'Differential Diagnosis',
    description: 'If the AI is uncertain, it provides a list of possible diseases to help the farmer investigate further.',
    icon: GitCompare,
  },
  {
    name: 'Prevention Strategies',
    description: 'Learn how to protect crops from future diseases with expert advice.',
    icon: Shield,
  },
];

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Tools for Healthy Crops
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Everything you need to diagnose and treat crop diseases, right at your fingertips.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}