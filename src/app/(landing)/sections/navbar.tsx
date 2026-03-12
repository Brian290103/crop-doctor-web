import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl px-2   mx-auto flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold text-primary">
              Crop Doctor 🌱
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="default">Admin Dashboard</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
