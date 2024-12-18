import { SocialLinks as Links } from "@/lib/types";
import { Github, Linkedin, Globe } from "lucide-react";

interface SocialLinksProps {
  socials?: Links;
}

export const SocialLinks = ({ socials }: SocialLinksProps) => {
  if (!socials) return null;

  return (
    <div className="flex gap-3 mt-3">
      {socials.github && (
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 transition-colors"
          aria-label="GitHub Profile"
        >
          <Github className="w-5 h-5" />
        </a>
      )}
      {socials.linkedin && (
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 transition-colors"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}
      {socials.portfolio && (
        <a
          href={socials.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 transition-colors"
          aria-label="Portfolio Website"
        >
          <Globe className="w-5 h-5" />
        </a>
      )}
    </div>
  );
};
