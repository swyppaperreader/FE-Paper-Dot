"use client";

export default function ReadingTools() {
  return (
    <section className="py-[80px] px-[40px] bg-[#F2F4F6]">
      <div className="max-w-[1200px] mx-auto">
        <div className="feature-container reversed">
          {/* Left: Image */}
          <div className="image-box">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-[#558AF0] rounded-lg flex items-center justify-center opacity-20">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColㄴr"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <p className="text-[#737A82] text-sm">
                  문장 단위 읽기 도구 이미지
                </p>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="text-content">
            <h3>문장 단위 읽기 도구</h3>
            <p>다양한 방식으로 문서를 읽어보세요</p>
            <p>
              원문과 번역문을 병렬로 보거나, 토글하여 전환하며, 또는 순차적으로
              읽을 수 있습니다.
            </p>
            <button className="bg-[#558AF0] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 hover:scale-105">
              읽기 도구 사용하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
