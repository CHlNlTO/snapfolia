"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RoleSection } from "../../components/component/RoleSection";
import {
  projectManagers,
  websiteDevelopers,
  aiResearchers,
  dataSpecialists,
  batch2023_2024,
} from "../../lib/data";
import { DeveloperItem } from "../../components/component/DeveloperItem";

export default function Developers() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="max-w-7xl mx-auto rounded-2xl bg-white/80 backdrop-blur-lg shadow-2xl p-8"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/assets/img/developers_logo.png"
              alt="Developers"
              width={180}
              height={72}
              className="object-contain"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-16"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-emerald-950 mb-2">
              Batch 2024-2025
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
          </div>

          <div className="space-y-16">
            <RoleSection title="Project Manager" developers={projectManagers} />
            <RoleSection
              title="Website Developers"
              developers={websiteDevelopers}
            />
            <RoleSection
              title="AI Research and Development"
              developers={aiResearchers}
            />
            <RoleSection
              title="Data Specialists"
              developers={dataSpecialists}
            />
          </div>

          <div className="text-center space-y-2 py-6">
            <p className="text-emerald-950/80 text-sm font-medium">
              BS Computer Science Batch 2025
            </p>
            <p className="text-emerald-950/80 text-sm font-medium">
              College of Computing and Information Technology
            </p>
          </div>

          <div className="pt-8 border-t border-emerald-100">
            <h2 className="text-4xl font-bold text-emerald-950 text-center mb-12">
              Batch 2023-2024
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {batch2023_2024.map((dev, index) => (
                <DeveloperItem key={index} {...dev} />
              ))}
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-emerald-950/80 text-sm font-medium">
              BS Computer Science Batch 2024
            </p>
            <p className="text-emerald-950/80 text-sm font-medium">
              College of Computing and Information Technology
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
