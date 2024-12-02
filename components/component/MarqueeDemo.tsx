import Marquee from "@/components/ui/marquee";
import Image from "next/image";

const reviews = [
  {
    name: "Acacia",
    username: "@acacia",
    body: "Large umbraculiform tree growing to a height of 20-25 meters.",
    img: "https://trees.firstasia.edu.ph/assets/img/leaf-acacia.jpg",
  },
  {
    name: "Bayabas",
    username: "@bayabas",
    body: "Leaves are alternate, simple oval with a point at the end.",
    img: "https://trees.firstasia.edu.ph/assets/img/leaf-bayabas.jpg",
  },
  {
    name: "Dao",
    username: "@dao",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://trees.firstasia.edu.ph/assets/img/leaf-dao.jpg",
  },
  {
    name: "Langka",
    username: "@langka",
    body: "Large tree, growing 30 meters or taller.",
    img: "https://trees.firstasia.edu.ph/assets/img/leaf-langka.jpg",
  },
  {
    name: "Mulawin",
    username: "@mulawin",
    body: "Flowers are blue, numerous, 6 to 8 millimeters long.",
    img: "https://trees.firstasia.edu.ph/assets/img/leaf-mulawin.jpg",
  },
  {
    name: "Talisay",
    username: "@talisay",
    body: "Leaves are shiny, obovate, and measure 10 to 25 centimeters long.",
    img: "https://trees.firstasia.edu.ph/assets/img/leaf-talisay.jpg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <div className="flex h-20 w-full max-w-72 cursor-pointer items-center justify-start rounded-2xl border border-transparent bg-neutral-100 backdrop-blur-[10px] transition duration-150 ease-in-out hover:scale-105 hover:border-neutral-500/20 dark:bg-neutral-800">
      <Image
        src={img}
        alt={name}
        className="ml-[14px] h-[50px] w-[50px] rounded-[10px] bg-gradient-to-br from-neutral-500/20 to-neutral-500/10"
        width={20}
        height={20}
      />
      <div className="ml-[10px] w-[calc(100%-90px)] text-neutral-700 dark:text-neutral-300">
        <div className="flex items-center justify-between">
          <p className="font-bold text-[16px]">{name}</p>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
            {username}
          </span>
        </div>
        <p className="line-clamp-2 font-light text-xs">{body}</p>
      </div>
    </div>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
      <Marquee pauseOnHover={false} className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover={false} className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
