import FileDropzone from "@/components/component/fileDropzone";
import { MarqueeDemo } from "@/components/component/MarqueeDemo";

export default function Home() {
  return (
    <main className="relative mx-auto flex flex-col items-center overflow-hidden space-y-20">
      {/* <Image
        src={branchBackground}
        alt="Branch Background"
        layout="fill"
        className="absolute object-cover "
      /> */}
      <section className="flex flex-col-reverse sm:flex-row items-center justify-center gap-0 sm:gap-28 mt-12 sm:mt-20">
        <FileDropzone />
        <div className="px-6 sm:px-0">
          <h1 className="text-7xl font-bold mt-10 text-green-900 max-w-[36rem]">
            Explore The World Of Trees
          </h1>
          <h3 className="text-2xl font-bold mt-2 text-green-900 opacity-75">
            Trees Are The Lungs Of The World
          </h3>
        </div>
      </section>
      <section>
        <MarqueeDemo />
      </section>
    </main>
  );
}
