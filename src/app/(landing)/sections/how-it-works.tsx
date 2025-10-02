import { Camera, BrainCircuit, FileCheck } from 'lucide-react';

const steps = [
  {
    name: '1. Provide Information',
    description: 'A farmer takes a photo of the affected crop using their phone or describes the symptoms.',
    icon: Camera,
  },
  {
    name: '2. AI Analysis',
    description: 'Our AI analyzes the data, identifies the crop, and searches its extensive knowledge base for matching diseases and conditions.',
    icon: BrainCircuit,
  },
  {
    name: '3. Receive Your Report',
    description: 'The farmer receives a detailed report in the app, including the probable diagnosis, severity, treatment plans, and preventative measures.',
    icon: FileCheck,
  },
];

export function HowItWorks() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get a Diagnosis in Three Simple Steps
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our mobile app makes it easy for farmers to get the help they need, right when they need it.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <step.icon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                  {step.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}