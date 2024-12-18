import { motion } from "framer-motion";
import { Developer } from "../../lib/types";
import { DeveloperItem } from "./DeveloperItem";

interface RoleSectionProps {
  title: string;
  developers: Developer[];
}

export const RoleSection = ({ title, developers }: RoleSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-12"
  >
    <h3 className="text-emerald-950 font-bold text-center text-2xl mb-8 relative">
      <span className="relative">
        {title}
        <motion.span
          className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </span>
    </h3>
    <div className="flex flex-wrap justify-center gap-6">
      {developers.map((dev, index) => (
        <DeveloperItem key={index} {...dev} />
      ))}
    </div>
  </motion.div>
);
