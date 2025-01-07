import Link from "next/link";
import { Calendar, PawPrintIcon as Paw, Users2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { checkAdminRole } from "@/utils/supabase/auth";

export default async function MobileNav() {
  const isAdmin = await checkAdminRole();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Paw className="h-8 w-8 bg-white stroke-black" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>Meny</SheetTitle>
        </SheetHeader>
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Paw className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Tønsberg Hundeklubb</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Calendar className="h-5 w-5" />
            Kalender
          </Link>

          {isAdmin.isAdmin && (
            <Link
              href="/calendar/users"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-5 w-5" />
              Medlemmer
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
