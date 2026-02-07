import styles from "./fifthMainScreen.module.css";
import Image from "next/image";

interface Step {
  id: number;
  description: React.ReactNode;  // string 대신 ReactNode로 변경
}

const steps: Step[] = [
  {
    id: 1,
    description: (
      <>
        읽고 싶은 영어 PDF를 업로드하거나,
        <br />
        텍스트를 불러옵니다.
      </>
    ),
  },
  {
    id: 2,
    description: "문장별로 번역된 텍스트를 읽습니다.",
  },
  {
    id: 3,
    description:
      "다 읽지 못한 문서는 내 문서함에 저장되어, 마지막 위치부터 이어 읽을 수 있습니다.",
  },
];

export default function HowToUse() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.mainTitle}>사용 방법</h2>
        </div>

        <div className={styles.timelineContainer}>
          {/* 이미지는 여기 한 번만 배치 */}
          <div className={styles.mainIllustrationWrapper}>
            <Image
              src="/mainfifth-image.svg"
              alt="사용 방법 일러스트"
              width={1000}
              height={320}
              className={styles.mainIllustration}
              priority
            />
          </div>

          {steps.map((step) => (
            <div key={step.id} className={styles.stepItem}>
              <div className={styles.stepLabel}>STEP {step.id}</div>
              <div className={styles.stepDotCircle} />
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