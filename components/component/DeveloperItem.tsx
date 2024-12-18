import { motion } from "framer-motion";
import Image from "next/image";
import { Developer } from "../../lib/types";
import { SocialLinks } from "./SocialLinks";

export const DeveloperItem = ({
  image,
  firstName,
  lastName,
  role,
  socials,
}: Developer) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="group relative flex flex-col items-center text-center w-[200px] p-4 rounded-xl bg-white/50 backdrop-blur-sm
    shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="relative w-[140px] h-[140px] mb-4">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse group-hover:animate-none" />
      <div className="absolute inset-[3px] rounded-full overflow-hidden bg-white">
        <Image
          src={`/assets/img/${image}`}
          alt={`${firstName} ${lastName}`}
          width={140}
          height={140}
          className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
    <div className="space-y-1 flex flex-col justify-center items-center">
      <h3 className="font-bold text-emerald-950 text-lg tracking-tight">
        {firstName}
      </h3>
      <h3 className="font-bold text-emerald-950 text-lg tracking-tight">
        {lastName}
      </h3>
      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
        {role}
      </span>
      <SocialLinks socials={socials} />
    </div>
  </motion.div>
);
