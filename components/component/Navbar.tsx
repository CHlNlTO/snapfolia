import { links, externalLinks } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu, Send } from "lucide-react";

export default function Navbar() {
  return (
    <header className="top-0 z-50 absolute w-screen">
      <section className="px-4 lg:px-6 h-14 flex justify-between items-center">
        <Link
          className="text-sm font-extrabold flex items-center justify-center gap-4 ring-green-600 focus:p-1 outline-green-600"
          href="/"
        >
          <Image
            src="/assets/snapfolia_logo.png"
            alt="Snapfolia"
            width={120}
            height={50}
            quality={100}
            className="quality-100"
          />
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-8 items-center justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              className="text-sm hover:underline underline-offset-4 text-green-900 font-bold ring-green-600 focus:p-1 outline-green-600"
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex justify-between items-center">
          <Link
            className="text-sm font-extrabold hidden md:flex items-center justify-center gap-4 ring-green-600 focus:p-1 outline-green-600"
            href={externalLinks.faith.url}
            target="_blank"
          >
            <Image
              src="/assets/faith_logo.png"
              alt="FAITH Colleges"
              width={115}
              height={50}
              quality={100}
            />
          </Link>
          <Link
            className="mr-3 text-sm font-extrabold flex sm:hidden items-center justify-center gap-4 ring-green-600 focus:p-1 outline-green-600"
            href={externalLinks.userFeedback.url}
            target="_blank"
          >
            <Send className="w-4 h-4 text-green-700 flex md:hidden ring-green-600 focus:p-1 outline-green-600" />
          </Link>
          <Sheet>
            <SheetTrigger>
              <Menu className="w-6 h-6 text-green-700 flex md:hidden ring-green-600 focus:p-1 outline-green-600" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="mb-4">
                  <Link
                    className="text-sm font-extrabold flex items-center justify-center ring-green-600 focus:p-1 outline-green-600"
                    href="/"
                  >
                    <Image
                      src="/assets/snapfolia_logo.png"
                      alt="Snapfolia"
                      width={120}
                      height={50}
                      quality={100}
                    />
                  </Link>
                </SheetTitle>
                <nav className="flex sm:hidden flex-col gap-4 sm:gap-8 items-center justify-center ring-green-600 focus:p-1 outline-green-600">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      className="text-sm hover:underline underline-offset-4 text-green-900 font-bold ring-green-600 focus:p-1 outline-green-600"
                      href={link.href}
                    >
                      <SheetClose>{link.name}</SheetClose>
                    </Link>
                  ))}
                </nav>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </section>
    </header>
  );
}
