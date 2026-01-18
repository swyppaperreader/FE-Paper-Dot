'use client';

import styles from './HowToUse.module.css';

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
        {/* 헤더 섹션 */}
        <div className={styles.header}>
          <h2 className={styles.mainTitle}>사용 방법</h2>
          <p className={styles.subtitle}>간단한 3단계로 시작하세요</p>
        </div>

        {/* ✨ 스텝 진행 인디케이터 (상단) */}
        <div className={styles.stepIndicator}>
          {steps.map((step, index) => (
            <div key={step.id} className={styles.indicatorWrapper}>
              {/* 굵은 점 */}
              <div
                className={styles.indicatorDot}
                aria-label={`Step ${step.id}`}
              />

              {/* 라벨 */}
              <span className={styles.indicatorLabel}>STEP {step.id}</span>

              {/* 점선 (마지막 제외) */}
              {index < steps.length - 1 && (
                <div className={styles.indicatorLine} />
              )}
            </div>
          ))}
        </div>

        {/* 스텝 이미지들 - 그리드 레이아웃 (텍스트와 동일) */}
        <div className={styles.imagesRow}>
          {steps.map((step, index) => (
            <div key={step.id} className={styles.imageWrapper}>
              {/* 이미지 영역 */}
              <div className={styles.stepImage}>
                <div className={styles.imagePlaceholder}>
                  <div className={styles.iconArea}>
                    <div className={styles.iconCircle}>
                      <span className={styles.icon} aria-hidden="true">
                        {step.icon}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 연결선 (마지막 제외) */}
              {index < steps.length - 1 && (
                <div className={styles.connectorLine} />
              )}
            </div>
          ))}
        </div>

        {/* 스텝 설명들 - 그리드 레이아웃 (이미지와 동일) */}
        <div className={styles.descriptionsRow}>
          {steps.map((step) => (
            <div key={step.id} className={styles.descriptionCard}>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}