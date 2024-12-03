import FileDropzone from "@/components/component/fileDropzone";
import { MarqueeDemo } from "@/components/component/MarqueeDemo";

export default function Home() {
  return (
    <main className="relative mx-auto flex flex-col items-center overflow-hidden space-y-20">
      <section className="flex flex-col-reverse lg:flex-row items-center justify-center gap-0 lg:gap-28 mt-2 lg:mt-20">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-[75%] -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80f0ff] to-[#89fc9c] opacity-30 sm:right-[calc(75%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <FileDropzone />
        <div className="px-6 sm:px-0">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mt-20 lg:mt-10 text-green-900 max-w-[36rem] text-center lg:text-left">
            Explore The Trees of Batangas
          </h1>
          <h3 className="text-md sm:text-2xl font-semibold mt-2 lg:mt-6 text-green-800/70 opacity-75 text-center lg:text-left">
            Upload a photo of a leaf to identify it
          </h3>
        </div>
      </section>
      <section>
        <MarqueeDemo />
      </section>
    </main>
  );
}
