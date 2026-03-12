
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 Crop Doctor. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
