import styles from "./mainTopScreen.module.css";
import Button from "@/app/components/button/Button";
import TextIcon from "@/public/text.svg";
import BgImage from "@/public/bg.svg";
import BackgroundSecondImage from "@/public/backgroundSecond.svg";

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
          <TextIcon />
          <span>텍스트 번역</span>
        </div>
      </div>
      <div className={styles.bgImageWrapper}>
        <BgImage />
        <div className={styles.backgroundSecondImageContainer}>
          <BackgroundSecondImage />
        </div>
      </div>
      <div className={styles.overLay} />
    </section>
  );
}
