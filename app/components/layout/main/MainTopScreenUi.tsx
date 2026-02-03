import Image from "next/image";
import styles from "./mainTopScreen.module.css";
import Button from "@/app/components/button/Button";

export default function MainTopScreenUi() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          길고 어려운 영어 텍스트를 문장별로 끊김 없이
        </h1>
        <p className={styles.description}>
          논문, 전공서적, 리포트, 매뉴얼.. 등 다양한 문서를 문장단위 번역으로
          끊김 없이 읽어보세요.
        </p>
        <Button>지금 시작하기</Button>
        <div className={styles.textButton}>
          <Image src="/text.svg" alt="text" width={24} height={24} />
          <span>텍스트 번역</span>
        </div>
      </div>
      <div className={styles.bgImageWrapper}>
        <Image
          src="/bg.svg"
          alt=""
          width={800}
          height={380}
          priority
          className={styles.bgImage}
        />
        <div className={styles.backgroundSecondImageContainer}>
          <Image
            src="/backgroundSecond.svg"
            alt=""
            width={216}
            height={180}
            priority
            className={styles.backgroundSecondImage}
          />
        </div>
      </div>
      <div className={styles.overLay} />
    </section>
  );
}
