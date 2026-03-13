import { Eye, MessageSquare, BookOpen, ListChecks, GitCompare, Shield } from 'lucide-react';

const features = [
  {
    name: 'Visual Diagnosis',
    description: 'Upload a photo of your affected crop and let our AI instantly identify the disease, crop type, and severity level with high accuracy.',
    icon: Eye,
  },
  {
    name: 'Text-Based Consultation',
    description: 'Not able to take a photo? Simply describe your crop symptoms in detail and our AI will analyze and provide a diagnosis.',
    icon: MessageSquare,
  },
  {
    name: 'Comprehensive Knowledge Base',
    description: 'Access a curated library of agricultural knowledge with research-backed information about crops, diseases, and treatments.',
    icon: BookOpen,
  },
  {
    name: 'Actionable Recommendations',
    description: 'Receive clear, step-by-step treatment advice including both organic and chemical options with dosages and safety tips.',
    icon: ListChecks,
  },
  {
    name: 'Differential Diagnosis',
    description: 'When uncertain, the AI provides multiple possible diagnoses to help you investigate and confirm the correct disease.',
    icon: GitCompare,
  },
  {
    name: 'Prevention Strategies',
    description: 'Learn expert advice on crop protection, resistant varieties, cultural practices, and early warning signs to prevent future outbreaks.',
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
            Everything you need to diagnose and treat crop diseases with expert-backed AI assistance, all in one intuitive platform.
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