'use client';

import { useState, useEffect } from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
  detail: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: '문서 업로드',
    description: '번역하고 싶은 문서를 업로드하세요.',
    detail:
      '텍스트를 직접 입력하거나 PDF 파일을 업로드할 수 있습니다. 드래그 앤 드롭으로 간편하게 파일을 추가할 수 있습니다.',
  },
  {
    id: 2,
    title: '자동 번역',
    description: 'AI가 자동으로 번역을 진행합니다.',
    detail:
      '업로드한 문서를 분석하여 문장별로 자동 번역합니다. 번역이 완료되면 원문과 번역문이 함께 표시됩니다.',
  },
  {
    id: 3,
    title: '확인 및 활용',
    description: '번역 결과를 확인하고 활용하세요.',
    detail:
      '문장별로 번역된 내용을 확인하고, 필요한 부분을 복사하거나 메모를 추가할 수 있습니다. 언제든지 다시 확인할 수 있습니다.',
  },
];

export default function HowToUse() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const nextStep = () => {
    setCurrentStep((prev) => (prev >= steps.length ? 1 : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev <= 1 ? steps.length : prev - 1));
  };

  const currentStepData = steps.find((s) => s.id === currentStep) || steps[0];

  return (
    <section className="py-[80px] px-[40px] bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="feature-container">
          {/* Left: Text Content */}
          <div className="text-content">
            <h3>사용 방법</h3>
            <p>간단한 3단계로 시작하세요</p>

            {/* Steps Indicator */}
            <div className="flex items-center space-x-4 my-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      currentStep === step.id
                        ? 'bg-[#558AF0] text-white scale-110 shadow-lg'
                        : currentStep > step.id
                        ? 'bg-[#B7B9C0] text-white'
                        : 'bg-[#F0F4FA] text-[#737A82]'
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step.id
                          ? 'bg-[#558AF0]'
                          : 'bg-[#E1E1E1]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step Info */}
            <div className="space-y-4">
              <div className="inline-block bg-[#558AF0] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                STEP {currentStep}
              </div>
              <h4 className="text-[20px] font-bold text-[#1A1A1A] leading-[1.3]">
                {currentStepData.title}
              </h4>
              <p className="text-base text-[#1A1A1A] leading-[1.8] font-medium">
                {currentStepData.description}
              </p>
              <p className="text-sm text-[#575D64] leading-[1.6]">
                {currentStepData.detail}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                onClick={prevStep}
                className="bg-white border-2 border-[#E1E1E1] text-[#474952] px-6 py-3 rounded-lg font-semibold hover:bg-[#F0F4FA] hover:border-[#558AF0] transition-all duration-300"
              >
                이전
              </button>
              <button
                onClick={nextStep}
                className="bg-[#558AF0] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 hover:scale-105"
              >
                다음
              </button>
            </div>
          </div>

          {/* Right: Visual */}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-[#737A82] text-sm">
                  {currentStepData.title} 시각화
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}