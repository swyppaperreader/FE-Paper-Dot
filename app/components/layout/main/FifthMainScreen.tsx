'use client';

import styles from './fifthMainScreen.module.css';

interface Step {
  id: number;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 1,
    description: '읽고 싶은 영어 PDF를 업로드하거나, 텍스트를 불러옵니다.',
    icon: '📄',
  },
  {
    id: 2,
    description: '문장별로 번역된 텍스트를 읽습니다.',
    icon: '⚡',
  },
  {
    id: 3,
    description: '다 읽지 못한 문서는 내 문서함에 저장되어, 마지막 위치부터 이어 읽을 수 있습니다.',
    icon: '✅',
  },
];

export default function HowToUse() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.mainTitle}>사용 방법</h2>
          {/* subtitle이 원래 코드에 없었지만, 필요하면 추가 */}
          {/* <p className={styles.subtitle}>3단계로 간단하게 시작하세요</p> */}
        </div>

        {/* 타임라인 전체 컨테이너 */}
        <div className={styles.timelineContainer}>
          {steps.map((step) => (
            <div key={step.id} className={styles.stepItem}>
              {/* STEP 라벨 */}
              <div className={styles.stepLabel}>STEP {step.id}</div>

              {/* 굵은 점 – 여기서 생성해야 .stepItem 기준으로 위치 잡힘 */}
              <div className={styles.stepDotCircle} />

              {/* 이미지 */}
              <div className={styles.stepImage}>
                <div className={styles.iconCircle}>
                  <span className={styles.icon}>{step.icon}</span>
                </div>
              </div>

              {/* 설명 */}
              <div className={styles.descriptionCard}>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}