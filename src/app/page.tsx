import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import PlacementSession from "@/components/sections/PlacementSession";
import OnboardingForm from "@/components/sections/OnboardingForm";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <HeroSection />
      <PlacementSession />
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center bg-[#F8FAFC]">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <OnboardingForm />
      </Suspense>
    </main>
  );
}
