import { Hero } from "./sections/hero";
import { Navbar } from "./sections/navbar";
import { About } from "./sections/about";
import { HowItWorks } from "./sections/how-it-works";
import { Features } from "./sections/features";
import { AdminSection } from "./sections/admin-section";
import { Footer } from "./sections/footer";
import { AppPreview } from "./sections/app-preview";
import { GetApp } from "./sections/get-app";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <AppPreview />
        <GetApp />
        <AdminSection />
      </main>
      <Footer />
    </div>
  );
}