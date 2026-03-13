import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function GetApp() {
  return (
    <div className="relative isolate overflow-hidden bg-green-600">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-20 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Get Started with Crop Doctor</h2>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Ready to diagnose your crop issues? Access Crop Doctor anytime, anywhere on any device. Get instant AI-powered disease identification and treatment recommendations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-x-6 gap-y-4">
            <Link href="/chat">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Chat Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}