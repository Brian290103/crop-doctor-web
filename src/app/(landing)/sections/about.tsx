import Image from 'next/image';
import { Stethoscope, Syringe, ShieldCheck } from 'lucide-react';

const features = [
  {
    name: 'Diagnosis',
    description:
      'Identifies the crop and disease with a confidence level.',
    icon: Stethoscope,
  },
  {
    name: 'Treatment',
    description:
      'Provides both organic and chemical treatment options with clear instructions.',
    icon: Syringe,
  },
  {
    name: 'Prevention',
    description:
      'Offers advice on how to prevent future outbreaks.',
    icon: ShieldCheck,
  },
];

export function About() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-green-600">Crop Doctor</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">A Plant Doctor in Every Farmer's Pocket</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Crop Doctor is an intelligent assistant for farmers, delivered through an intuitive mobile app. It empowers farmers to identify and resolve crop issues quickly and effectively. By simply uploading a photo of a crop or describing its symptoms in the app, a farmer can get a reliable diagnosis and a clear action plan.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-green-600" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            src="https://img.freepik.com/free-photo/asian-woman-farmer-with-digital-tablet-corn-field-beautiful-morning-sunrise-corn-field-green-corn-field-agricultural-garden-light-shines-sunset-evening-mountain-background_1150-45620.jpg?t=st=1759402385~exp=1759405985~hmac=0a620c6433b9eaa46a400629cd9367e057de4c7aaf3a6f65567a72831c5c5568&w=1480"
            alt="Farmer checking crops"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  );
}