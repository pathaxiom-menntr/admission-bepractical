"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicCourses } from "@/services/courses.service";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you! We will contact you at ${email} shortly.`);
    setEmail("");
  };

  const { data: apiCourses = [] } = useQuery({
    queryKey: ["publicCourses"],
    queryFn: getPublicCourses,
  });

  const displayCourses: string[] = apiCourses.map((c: any) => c.title);

  return (
    <footer className="w-full bg-[#0C005E] text-white py-16 relative z-10 border-t border-[#090044]">
      <div className="px-6 sm:px-12 lg:px-20">
        {/* Main Grid Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-6">
          {/* Column 1: Brand Logo & Bio (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md p-1"
              aria-label="Be Practical Home"
            >
              <Image
                src="/images/logo.png"
                alt="Be Practical Logo"
                width={180}
                height={50}
                priority
                className="h-30 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Practical IT training with industry-focused learning and placement
              support.
            </p>
          </div>

          {/* Column 2: Popular Courses (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight font-montserrat">
              Popular Courses
            </h3>
            <ul className="space-y-3 w-full">
              {displayCourses.map((course: string, idx: number) => (
                <li key={idx} className="flex items-center text-sm">
                  {/* Small Bullet Dot */}
                  <span className="mr-2 text-slate-400 font-bold select-none">
                    •
                  </span>
                  <Link
                    href={`/?course=${encodeURIComponent(course)}`}
                    className="text-slate-300 hover:text-white hover:underline transition-colors duration-200 text-left font-medium"
                  >
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact details (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight font-montserrat">
              Contact
            </h3>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed w-full">
              <p>
                <a
                  href="https://maps.google.com/?q=Be+Practical+Tech+Solutions+Basaveshwara+Nagar+Bengaluru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors duration-200 block"
                >
                  #737C, 1stFloor, 1st cross 3rd Stage, 4th Block Basaveshwara
                  nagar Bengaluru-560079
                </a>
              </p>
              <p>
                <a
                  href="tel:+91-9242079119"
                  className="hover:text-white transition-colors duration-200"
                >
                  +91-9242079119
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@be-practical.com"
                  className="hover:text-white hover:underline transition-colors duration-200"
                >
                  info@be-practical.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 4: Newsletter / Enquire Now Form (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight font-montserrat">
              Enquire Now
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Fill your details and our expert will contact you shortly.
            </p>

            <form onSubmit={handleEmailSubmit} className="relative w-full">
              <div className="flex items-center bg-white rounded-full p-1 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-300">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Submit Email"
                  className="flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#4A31F4_10%,#422CD5_35%,#2160D6_65%,#3A9CFC_90%)] text-white p-3 transition-all duration-200 active:scale-95 shadow-md hover:opacity-95 cursor-pointer mr-0.5"
                >
                  <svg
                    className="w-3.5 h-3.5 transform rotate-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
