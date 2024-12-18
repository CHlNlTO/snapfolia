"use client";

import { useState } from "react";
import { leaves } from "@/lib/data";
import LeafCard from "@/components/component/LeafCard";
import SearchBar from "@/components/component/SearchBar";
import { motion } from "framer-motion";
import { GradientBackground } from "@/components/component/GradientBackground";

export default function Dataset() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("all");

  const filteredLeaves = leaves.filter(
    (leaf) =>
      leaf.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (location === "all" || leaf.location === location)
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen dark:from-green-950 dark:to-zinc-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full py-16 px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="max-w-7xl mx-auto text-center relative">
          <GradientBackground />

          <div className="flex flex-col items-center gap-4 z-50">
            <h1 className="text-4xl font-bold text-green-900 dark:text-green-100 sm:text-5xl md:text-6xl">
              Leaf Datasets
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Explore our comprehensive collection of leaf specimens within
              Batangas.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-center"
      >
        <div className="max-w-7xl w-full flex items-center justify-center">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            location={location}
            setLocation={setLocation}
          />
        </div>
      </motion.section>

      {/* Results Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leaf) => (
                <motion.div
                  key={leaf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LeafCard leaf={leaf} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No leaves found matching your search criteria
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
