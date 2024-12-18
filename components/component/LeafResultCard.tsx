import { Card, CardContent } from "@/components/ui/card";
import { leaves } from "@/lib/data";
import { LeafClass } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { Medal } from "lucide-react";

interface LeafResultCardProps {
  result: LeafClass;
  onClick: () => void;
  className?: string;
  rank: number;
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "text-yellow-500";
    case 2:
      return "text-gray-400";
    case 3:
      return "text-amber-600";
    default:
      return "text-gray-300";
  }
};

const getRankIcon = (rank: number) => {
  if (rank <= 3) {
    return <Medal className={`w-5 h-5 ${getRankColor(rank)}`} />;
  }
  return <span className="text-sm font-medium text-gray-400">#{rank}</span>;
};

export const LeafResultCard = ({
  result,
  onClick,
  className = "",
  rank,
}: LeafResultCardProps) => {
  const leafData = leaves.find(
    (leaf) => leaf.name.toLowerCase() === result.class.toLowerCase()
  );

  const confidenceColor =
    result.confidence > 80
      ? "bg-green-500"
      : result.confidence > 60
      ? "bg-green-400"
      : "bg-green-300";

  return (
    <motion.div whileTap={{ scale: 0.98 }} onClick={onClick} className="w-full">
      <Card
        className={`w-full cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
      >
        <CardContent className="p-4 flex items-center gap-4 w-full">
          <div className="flex-shrink-0 flex items-center justify-center w-8">
            {getRankIcon(rank)}
          </div>

          {leafData && (
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src={leafData.image}
                alt={result.class}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-green-900 truncate">
              {result.class}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 bg-green-100 rounded-full flex-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${confidenceColor} rounded-full`}
                />
              </div>
              <span className="text-sm font-medium text-green-700 flex-shrink-0">
                {result.confidence.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
