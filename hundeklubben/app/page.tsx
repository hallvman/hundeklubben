import ContactSection from "@/components/frontpage/ContactSection";
import Events from "@/components/frontpage/events";
import Hero from "@/components/frontpage/hero";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <Hero />
      <Separator />
      <Events />
      <Separator />
      <ContactSection />
    </div>
  );
}
