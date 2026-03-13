
import Image from 'next/image';

export function AppPreview() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">See the Platform in Action</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful and Easy to Use
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Access Crop Doctor seamlessly on any device—desktop, tablet, or mobile. Enjoy a responsive interface designed for farmers, anywhere you are.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-center gap-8">
            <Image
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              src="/screen1.jpg"
              alt="Crop Doctor chat interface"
              width={250}
              height={500}
            />
            <Image
              className="mt-[4%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              src="/screen2.jpg"
              alt="Crop Doctor dashboard"
              width={250}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
