'use client';

import Link from 'next/link';

interface TargetUser {
  id: string;
  title: string;
  description: string;
}

const targetUsers: TargetUser[] = [
  {
    id: 'student',
    title: '논문 읽는 대학생 또는 연구자',
    description: '복잡한 학술 논문을 빠르게 이해하고 연구에 집중하세요.',
  },
  {
    id: 'highschool',
    title: '수능 영어 지문 분석하고 싶은 고3',
    description: '수능 영어 지문을 문장별로 분석하여 실전 감각을 키우세요.',
  },
  {
    id: 'professional',
    title: '영어 텍스트를 소비하는 실무자',
    description: '업무 문서와 리포트를 효율적으로 읽고 이해하세요.',
  },
];

export default function CheckSection() {
  return (
    <section
      id="check"
      className="py-[80px] px-[40px] bg-[#F2F4F6]"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#1A1A1A] text-center mb-12 md:mb-16 leading-[1.3]">
          번역기 열고, 복사하고,
          <br />
          다시 돌아오는 시간이 아까웠던 사람을 위해 만들었습니다.
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {targetUsers.map((user, index) => (
            <div key={user.id} className="relative">
              <div className="feature-card">
                <h4 className="text-[20px] md:text-[24px] font-bold text-[#1A1A1A] mb-4 leading-[1.3]">
                  {user.title}
                </h4>
                <p className="text-sm text-[#666] leading-[1.6]">
                  {user.description}
                </p>

                {/* 두번째 박스 밑에 버튼 추가 */}
                {index === 1 && (
                  <div className="mt-6 pt-6 border-t border-[#E1E1E1]">
                    <Link
                      href="/signup"
                      className="block w-full bg-[#558AF0] text-white py-3 rounded-lg font-semibold hover:bg-[#1D4084] transition-all duration-300 text-center"
                    >
                      문장단위 번역 시작하기
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}