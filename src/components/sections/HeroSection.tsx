"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white h-[calc(100vh-72px)] min-h-[440px] flex flex-col justify-between">
      {/* Background Image on Right with Fading Gradient Overlay */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <div className="relative w-full lg:w-3/4 h-full">
          <Image
            src="/images/bg.png"
            alt="Be Practical Campus and Students"
            fill
            priority
            className="object-cover object-right lg:object-center"
          />
          {/* Gradient fade from solid white on the left to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 sm:via-white/75 lg:via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-transparent lg:hidden" />
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-20 w-full my-auto py-2">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl">
          {/* Tagline */}
          <p className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#4A31F4_25%,#422CD5_50%,#2160D6_75%,#3A9CFC_100%)] font-medium text-sm md:text-base lg:text-2xl tracking-tight">
            Admission Portal
          </p>

          {/* Main Heading */}
          <h1 className="mt-1 text-2xl md:text-4xl lg:text-5xl font-semibold text-[#000000]">
            Your Career Journey <br className="hidden sm:inline" />
            Begins <span className="text-transparent bg-clip-text bg-[linear-gradient(155deg,#4A31F4_25%,#422CD5_50%,#2160D6_75%,#3A9CFC_100%)]">Here.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-[#000000] text-sm md:text-base lg:text-xl leading-relaxed font-normal max-w-lg">
            You&apos;re just a few steps away from becoming a Be Practical
            student. Verify your details, complete the remaining information,
            and secure your seat.
          </p>

          {/* Admission Progress Card */}
          <div className="mt-4 bg-white rounded-2xl p-4 max-w-[260px] md:max-w-[280px] shadow-[0px_6px_15.8px_0px_rgba(31,7,125,0.25)]">
            <h2 className="text-center font-semibold text-[#000000] text-sm md:text-base lg:text-xl">
              Admission Progress
            </h2>

            {/* Circular Donut Progress (50%) */}
            <div className="relative flex items-center justify-center my-2.5">
              <svg
                className="w-20 h-20 md:w-30 md:h-30 lg:w-40 lg:h-40 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background gray circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Active blue progress arc (50%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#1D4ED8"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="251.32"
                  strokeDashoffset="125.66"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex items-center justify-center">
                <span className="font-montserrat text-base md:text-lg lg:text-2xl font-semibold text-[#000000]">50%</span>
              </div>
            </div>

            {/* Step Status */}
            <div className="text-center font-montserrat">
              <p className="text-[#0746E8] font-semibold text-sm md:text-base lg:text-xl">
                Step 2 Of 4
              </p>
              <p className="text-[#000000] text-xs md:text-base lg:text-lg mt-0.5 font-medium">
                Additional Details
              </p>
            </div>

            {/* Start Admission Button */}
            <button className="mt-3 w-full py-2 px-4 rounded-xl bg-[linear-gradient(90deg,#4A31F4_25%,#422CD5_50%,#2160D6_75%,#3A9CFC_100%)] text-white font-medium text-sm md:text-base lg:text-lg cursor-pointer">
              Start Admission
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Wave Graphic (Blue, Yellow, Red) */}
      <div className="relative z-20 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-10 lg:h-12 block"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="heroWaveGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#0038B8" />
              <stop offset="40%" stopColor="#0052FF" />
              <stop offset="68%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
          <path
            d="M0 12 C 360 50, 720 -5, 1440 15 L 1440 50 L 0 50 Z"
            fill="url(#heroWaveGrad)"
          />
        </svg>
      </div>
    </section>
  );
}
