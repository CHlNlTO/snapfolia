import Marquee from "@/components/ui/marquee";
import Image from "next/image";
import { leaves } from "@/lib/data";

const firstRow = leaves.slice(0, leaves.length / 2);
const secondRow = leaves.slice(leaves.length / 2);

const ReviewCard = ({
  name,
  scientificName,
  shortDescription,
  image,
  index,
}: {
  name: string;
  scientificName: string;
  shortDescription: string;
  image: string;
  index: number;
}) => {
  return (
    <div
      className={`flex h-20 w-full max-w-72 cursor-pointer items-center justify-start rounded-2xl border border-transparent ${
        index % 2 === 0 ? "bg-green-50" : "bg-green-100"
      } backdrop-blur-[10px] transition duration-150 ease-in-out hover:scale-105 hover:border-green-400/20 dark:bg-neutral-800`}
    >
      <Image
        src={image}
        alt={name}
        className="ml-[14px] h-[50px] w-[50px] rounded-[10px] bg-gradient-to-br from-neutral-500/20 to-neutral-500/10"
        width={20}
        height={20}
      />
      <div className="ml-[10px] w-[calc(100%-90px)] text-neutral-700 dark:text-neutral-300">
        <div className="flex items-center justify-between">
          <p className="font-bold text-[16px]">{name}</p>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
            {scientificName}
          </span>
        </div>
        <p className="line-clamp-2 font-light text-xs">{shortDescription}</p>
      </div>
    </div>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[200px] sm:h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
      <Marquee pauseOnHover={false} className="[--duration:70s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={review.scientificName} {...review} index={index} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover={false} className="[--duration:70s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={review.scientificName} {...review} index={index} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
