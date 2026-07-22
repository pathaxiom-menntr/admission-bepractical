"use client";

import Image from "next/image";
import TickCircleIcon from "../icons/TickCircleIcon";

const placementData = [
  {
    id: 1,
    name: "Ravi Kumar",
    role: "Software Engineer",
    package: "₹7.2 LPA",
    company: "LG",
    logo: "/images/lg.png",
    image: "/images/student1.jpg",
  },
  {
    id: 2,
    name: "Senthil Kumar",
    role: "Software Engineer",
    package: "₹96 LPA",
    company: "Wipro",
    logo: "/images/wipro.png",
    image: "/images/student2.jpg",
  },
  {
    id: 3,
    name: "Hinata",
    role: "Data Scientist",
    package: "₹6 LPA",
    company: "Infosys",
    logo: "/images/infosys.png",
    image: "/images/student3.jpg",
  },
  {
    id: 4,
    name: "Roshini",
    role: "Data Scientist",
    package: "₹6 LPA",
    company: "IBM",
    logo: "/images/ibm.png",
    image: "/images/student4.jpg",
  },
  {
    id: 5,
    name: "Ravi Kumar",
    role: "Software Engineer",
    package: "₹7.2 LPA",
    company: "LG",
    logo: "/images/lg.png",
    image: "/images/student1.jpg",
  },
];

export default function PlacementSession() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D91A7F1A] border border-[#FCE7F3]">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#D91A7F] text-white text-sm">
            ★
          </span>
          <span className="text-sm md:text-base lg:text-xl font-medium font-montserrat text-[#D91A7F] uppercase">
            Placement Session
          </span>
        </div>

        {/* Heading with Soundwave Accents */}
        <div className="mt-4 flex items-center justify-center gap-4 sm:gap-8 lg:gap-10">
          {/* Left accent graphic */}
          <div className="relative w-10 h-5 sm:w-14 sm:h-7 md:w-16 md:h-8 shrink-0 mr-1 sm:mr-2 md:mr-3 lg:mr-30">
            <Image
              src="/images/left.png"
              alt="Decorative Left Accent"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000000] tracking-tight text-center">
            You Can Be{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(180deg,#F81261_0%,#533AFD_100%)] font-montserrat">
              Next
            </span>
          </h2>

          {/* Right accent graphic */}
          <div className="relative w-10 h-5 sm:w-14 sm:h-7 md:w-16 md:h-8 shrink-0 ml-1 sm:ml-2 md:ml-3 lg:ml-30">
            <Image
              src="/images/right.png"
              alt="Decorative Right Accent"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="mt-3 text-center text-sm md:text-base lg:text-xl text-[#000000] font-montserrat font-normal max-w-3xl">
          Real Student , Real Offers , Real Careers At India&apos;s Leading Companies
        </p>

        {/* Cards Grid / Carousel Container */}
        <div className="mt-10 sm:mt-12 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6 justify-items-center">
          {placementData.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-[240px] bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_0_12px_rgba(0,0,0,0.12)] hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center justify-between"
            >
              {/* Company Logo Container */}
              <div className="h-12 w-full flex items-center justify-center">
                <Image
                  src={item.logo}
                  alt={item.company}
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </div>

              {/* Student Image */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden my-4 border-2 border-white shadow-sm">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Student Info */}
              <div className="w-full">
                <h3 className="font-semibold text-[#000000] text-sm md:text-base lg:text-xl">
                  {item.name}
                </h3>
                <p className="font-montserrat text-sm md:text-base lg:text-lg text-[#000000] font-normal mt-0.5">
                  {item.role}
                </p>

                {/* Salary Package */}
                <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#A50034] mt-2 mb-3">
                  {item.package}
                </p>
              </div>

              {/* Divider Line */}
              <div className="w-full border-t border-[#0000005C] my-2" />

              {/* Bottom Placed Successfully Badge */}
              <div className="w-full py-3 px-3 rounded-full bg-[#E9FBF1] text-[#286C48] text-xs md:text-sm font-montserrat font-semibold flex items-center justify-center gap-2">
                <span className="text-white">
                  <TickCircleIcon size={20} />
                </span>
                <span>Placed Successfully</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
