'use client';

import Link from 'next/link';

interface Feature {
  id: string;
  title: string;
  description: string;
  buttonText: string;
}

const features: Feature[] = [
  {
    id: 'fast-reading',
    title: '문장별 번역으로 더 빠르게 읽기',
    description:
      '원문과 번역문을 문장 단위로 매칭하여 빠르게 읽고 이해할 수 있습니다. 복잡한 영어 문서도 쉽게 소화하세요.',
    buttonText: '지금 바로 시작하기',
  },
  {
    id: 'continue-reading',
    title: '내 문서함에서 이어서 읽기',
    description:
      '이전에 읽던 문서를 문서함에서 바로 이어서 읽을 수 있습니다. 언제든지 중단한 지점부터 다시 시작하세요.',
    buttonText: '문서함 보기',
  },
  {
    id: 'pdf-jump',
    title: 'pdf 뷰어로 원하는 곳에 즉시 점프',
    description:
      'PDF 문서에서 원하는 페이지나 섹션으로 즉시 이동할 수 있습니다. 긴 문서도 빠르게 탐색하세요.',
    buttonText: 'PDF 뷰어 사용하기',
  },
];

export default function FeatureTabs() {
  return (
    <>
      {features.map((feature) => (
        <section
          key={feature.id}
          className="py-[80px] px-[40px] bg-white"
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="feature-container">
              {/* Left: Image */}
              <div className="image-box">
                <div className="w-full h-full flex items-center justify-center">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-[#737A82] text-sm">
                      {feature.title} 이미지
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="text-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link
                  href="/signup"
                  className="inline-block bg-[#558AF0] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 hover:scale-105"
                >
                  {feature.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}