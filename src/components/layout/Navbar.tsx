"use client";

import Image from "next/image";
import Link from "next/link";
import CallIcon from "@/components/icons/CallIcon";

interface NavbarProps {
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function Navbar({ ctaText = "Enquire Now", onCtaClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white py-3.5 shadow-[0px_8px_24px_0px_rgba(29,78,216,0.08)]">
      <div className="px-6 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
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
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* CTA / Enquiry Button */}
          <button
            onClick={onCtaClick}
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-[linear-gradient(155deg,#4A31F4_20%,#422CD5_50%,#2160D6_75%,#3A9CFC_100%)] cursor-pointer"
          >
            <CallIcon
              className="text-white transition-transform duration-300 group-hover:rotate-12"
              size={16}
            />
            <span>{ctaText}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
