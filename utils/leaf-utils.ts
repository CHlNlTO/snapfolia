import { leaves } from "@/lib/data";

interface LeafDetails {
  englishName: string;
  scientificName: string;
}

export const getLeafDetails = (label: string): LeafDetails => {
  const leaf = leaves.find((l) => l.name.toLowerCase() === label.toLowerCase());

  return {
    englishName: leaf?.englishName?.trim() || "Not found",
    scientificName: leaf?.scientificName || "Not found",
  };
};
