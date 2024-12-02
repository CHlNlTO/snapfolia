import { links, externalLinks } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import snapfoliaLogo from "@/app/assets/snapfolia_logo.png";
import faithLogo from "@/app/assets/faith_logo.png";

export default function Navbar() {
  return (
    <header>
      <section className="px-4 lg:px-6 h-14 flex justify-between items-center border-b-[.1px] border-gray-100 border-opacity-1">
        <Link
          className="text-sm font-extrabold flex items-center justify-center gap-4"
          href="/"
        >
          <Image src={snapfoliaLogo} alt="Snapfolia" width={120} />
        </Link>
        <nav className="hidden sm:flex gap-4 sm:gap-8 items-center justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              className="text-sm hover:underline underline-offset-4 text-green-900 font-bold"
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <Link
          className="text-sm font-extrabold hidden sm:flex items-center justify-center gap-4"
          href={externalLinks.faith.url}
          target="_blank"
        >
          <Image src={faithLogo} alt="FAITH Colleges" width={115} />
        </Link>
      </section>
    </header>
  );
}
