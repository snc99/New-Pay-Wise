"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineLogin } from "react-icons/md";
// import ThemeToggle from "@/app/components/button/themeToggle";

export default function Header() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu toggle

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-10 mx-auto flex items-center justify-between bg-white px-4 py-2 shadow-md">
      <div className={`text-xl font-bold ${isMenuOpen ? "hidden" : "block"}`}>
        Pay Wise
      </div>

      <button
        className="text-2xl lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        &#9776;
      </button>

      <nav
        aria-label="Main navigation"
        className={`${
          isMenuOpen ? "block" : "hidden"
        } w-full lg:block lg:w-auto`}
      >
        <ul className="flex flex-col items-center gap-4 sm:gap-6 lg:flex-row lg:gap-8">
          {["Home", "About", "Debt", "Services", "Contact"].map((section) => (
            <li key={section}>
              <Link
                href={`#${section}`}
                className={
                  activeSection === section
                    ? "font-bold text-gray-500"
                    : "text-[#7dd3fc]"
                }
              >
                {section}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="button-login flex items-center gap-2 rounded px-4 py-2 text-blue-500"
              onClick={() => router.push("/auth/login")}
            >
              Login <MdOutlineLogin size={20} />
            </button>
          </li>
          {/* <li>
            <ThemeToggle />
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
