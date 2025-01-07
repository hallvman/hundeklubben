"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // If the current path is "/calendar", don't render the header
  if (pathname.startsWith("/calendar")) {
    return null;
  }
  return (
    <footer className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2025 Dog Club Calendar. All rights reserved.</p>
      </div>
    </footer>
  );
}
