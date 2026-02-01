import styles from "./fifthMainScreen.module.css";

interface Step {
  id: number;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 1,
    description: "읽고 싶은 영어 PDF를 업로드하거나, 텍스트를 불러옵니다.",
    icon: "📄",
  },
  {
    id: 2,
    description: "문장별로 번역된 텍스트를 읽습니다.",
    icon: "⚡",
  },
  {
    id: 3,
    description:
      "다 읽지 못한 문서는 내 문서함에 저장되어, 마지막 위치부터 이어 읽을 수 있습니다.",
    icon: "✅",
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

        {/* ========== 최상단: STEP 1, 2, 3 텍스트 ========== */}
        <div className={styles.stepLabelsRow}>
          {steps.map((step) => (
            <div key={`label-${step.id}`} className={styles.stepLabelWrapper}>
              <span className={styles.stepLabelText}>STEP {step.id}</span>
            </div>
          ))}
        </div>

        {/* ========== 두 번째: 점과 점선 ========== */}
        <div className={styles.stepDotsRow}>
          {/* 첫 번째 점에서 마지막 이미지 오른쪽 끝까지 연결하는 점선 */}
          <div className={styles.stepLineConnector} />

          {steps.map((step) => (
            <div key={`dot-${step.id}`} className={styles.stepDotWrapper}>
              {/* 굵은 점 */}
              <div className={styles.stepDot} />
            </div>
          ))}
        </div>

        {/* ========== 세 번째: 이미지 3개 가로 배치 ========== */}
        <div className={styles.imagesRow}>
          {steps.map((step) => (
            <div key={`image-${step.id}`} className={styles.imageWrapper}>
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
            </div>
          ))}
        </div>

        {/* ========== 하단: 설명 3개 가로 배치 ========== */}
        <div className={styles.descriptionsRow}>
          {steps.map((step) => (
            <div key={`desc-${step.id}`} className={styles.descriptionCard}>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
