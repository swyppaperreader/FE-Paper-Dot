'use client';

import { useState } from 'react';

type TabType = 'text' | 'pdf';

export default function TranslationFeature() {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  return (
    <section
      id="translation"
      className="py-[80px] px-[40px] bg-[#F2F4F6]"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-[48px] items-start">
          {/* Left: Description */}
          <div className="space-y-6 content-left">
            <h2 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#1A1A1A] leading-[1.3]">
              번역하고,
              <br />
              문장별로 확인하니까
            </h2>
            <p className="text-base md:text-lg text-[#1A1A1A] leading-[1.8] font-medium">
              복잡한 영어 문서를 간단하게 번역하고,
              <br />
              원문과 번역문을 문장 단위로 매칭하여
              <br />
              더 쉽게 이해할 수 있습니다.
            </p>
            <button className="bg-[#558AF0] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 hover:scale-105">
              지금 바로 시작하기
            </button>
          </div>

          {/* Right: Translation UI Mockup with Tabs */}
          <div className="space-y-4 content-right">
            {/* Tabs */}
            <div className="flex space-x-2 bg-white rounded-t-lg p-2 border-b-2 border-[#E1E1E1]">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'text'
                    ? 'bg-[#558AF0] text-white shadow-md scale-105'
                    : 'bg-transparent text-[#737A82] hover:bg-[#F0F4FA]'
                }`}
              >
                텍스트 번역
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'pdf'
                    ? 'bg-[#558AF0] text-white shadow-md scale-105'
                    : 'bg-transparent text-[#737A82] hover:bg-[#F0F4FA]'
                }`}
              >
                PDF 번역
              </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-b-lg shadow-xl p-[32px] min-h-[400px] animate-fade-in">
              {activeTab === 'text' ? (
                <div className="space-y-6">
                  {/* Translation Pair - 2열 배치 */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left: English */}
                    <div className="translation-box">
                      <p className="text-sm text-[#737A82] mb-4 font-medium">원문</p>
                      <p className="text-base text-[#2C3E50] leading-[1.8] font-normal">
                        Machine learning is a subset of artificial intelligence
                        that focuses on the use of data and algorithms to
                        imitate the way humans learn.
                      </p>
                    </div>
                    {/* Right: Korean */}
                    <div className="translation-box">
                      <p className="text-sm text-[#737A82] mb-4 font-medium">번역</p>
                      <p className="text-base text-[#1A1A1A] leading-[1.8] font-medium">
                        머신러닝은 인간이 학습하는 방식을 모방하기 위해 데이터와
                        알고리즘을 사용하는 것에 중점을 둔 인공지능의 한 분야입니다.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E1E1E1]">
                    <button className="w-full bg-[#558AF0] text-white py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-colors duration-300">
                      번역하기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto bg-[#558AF0] rounded-lg flex items-center justify-center mb-4 opacity-20">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-[#737A82] mb-4">
                      PDF 파일을 업로드하세요
                    </p>
                    <button className="bg-[#558AF0] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-colors duration-300">
                      파일 선택
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}