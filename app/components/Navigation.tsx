'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'hero', label: '1' },
  { id: 'translation', label: '2' },
  { id: 'features', label: '3' },
  { id: 'check', label: '4' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth',
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-2xl font-bold text-[#558AF0] hover:text-[#1D4084] transition-colors duration-300"
            >
              Paperdot.
            </button>
          </div>

          {/* Progress Indicator - Desktop (중앙) */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            {sections.map((section, index) => (
              <div key={section.id} className="flex items-center">
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${activeSection === section.id
                      ? 'bg-[#558AF0] text-white scale-110'
                      : 'bg-[#F0F4FA] text-[#737A82] hover:bg-[#DEE3EB] hover:scale-105'
                    }`}
                  aria-label={`Go to section ${section.label}`}
                >
                  {section.label}
                </button>
                {index < sections.length - 1 && (
                  <div className="w-8 h-0.5 bg-[#DEE3EB] mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons - 우측 끝 */}
          <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
            <Link
              href="/login"
              className="text-[#474952] hover:text-[#558AF0] transition-colors duration-300 px-3 py-2 text-sm md:text-base md:px-4 whitespace-nowrap"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="bg-[#558AF0] text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:bg-[#1D4084] transition-all duration-300 hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              회원가입
            </Link>
          </div>

          {/* Mobile Menu Button - 모바일에서만 표시 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-[#474952] hover:text-[#558AF0] transition-colors duration-300 ml-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E1E1E1]">
            <div className="flex flex-col space-y-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors duration-300 ${activeSection === section.id
                      ? 'bg-[#558AF0] text-white'
                      : 'text-[#474952] hover:bg-[#F0F4FA]'
                    }`}
                >
                  {section.label}. {section.id}
                </button>
              ))}
              <div className="border-t border-[#E1E1E1] pt-4 mt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-[#474952] hover:text-[#558AF0] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 bg-[#558AF0] text-white rounded-lg hover:bg-[#1D4084] transition-colors duration-300 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}