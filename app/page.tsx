import UserGuideModal from "@/components/component/UserGuideModal";
import Home from "./home/Home";
import { GradientBackground } from "@/components/component/GradientBackground";

export default function Page() {
  return (
    <main className="overflow-hidden">
      <UserGuideModal />
      <Home />
      <GradientBackground />
    </main>
  );
}
