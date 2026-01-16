'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="py-[80px] px-[40px] bg-white"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-[48px] items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 animate-fade-in-up content-left">
            <h1 className="text-[36px] md:text-[42px] lg:text-[48px] font-bold text-[#1A1A1A] leading-[1.3]">
              길고 어려운 영어 텍스트를 문장별로 끊김 없이
            </h1>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1A1A1A] leading-[1.8] font-medium">
                논문, 전공서적, 리포트, 메뉴얼 등 다양한 문서를
                <br />
                원문과 한글 번역을 문장 단위로 병렬 표시해
                <br />
                더 쉽고 빠르게 이해하세요.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/signup"
                className="inline-block bg-[#558AF0] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>

          {/* Right: Screenshot Placeholder */}
          <div className="relative animate-fade-in-up-delayed">
            <div className="bg-gradient-to-br from-[#F0F4FA] to-[#DEE3EB] rounded-2xl shadow-2xl p-[32px] md:p-[40px] aspect-video flex items-center justify-center border-2 border-[#C7CDD4]">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-[#558AF0] rounded-lg flex items-center justify-center opacity-20">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-[#737A82] text-sm">
                  제품 스크린샷 영역
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
