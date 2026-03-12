import Image from 'next/image';

export function GetApp() {
  return (
    <div className="relative isolate overflow-hidden bg-green-600">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-20 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Download Crop Doctor Today</h2>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Ready to get started? Scan the QR code with your phone's camera or use the buttons below to download the Crop Doctor app from your app store.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a href="https://expo.dev/accounts/saitah/projects/crop-doctor-mobile/builds/640d68a3-88c2-4811-868c-86daa02051ef" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              App Store
            </a>
            <a href="https://expo.dev/accounts/saitah/projects/crop-doctor-mobile/builds/640d68a3-88c2-4811-868c-86daa02051ef" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Google Play
            </a>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <div className="mx-auto w-48">
            <Image
              src="/qr.png"
              alt="QR code to download the app"
              width={300}
              height={300}
              className="rounded-lg bg-white p-2 shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}