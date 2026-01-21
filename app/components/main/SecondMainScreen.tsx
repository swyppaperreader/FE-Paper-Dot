import Button from "../button/Button";
import styles from "./secondMainScreen.module.css";
import MainImage from "@/public/main.svg";

export default function SecondMainScreen() {
  return (
    <section className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            번역하고,
            <br /> 문장별로 확인하니까
          </h1>
          <Button style={styles.button}>지금 시작하기</Button>
          <p className={styles.description}>
            "어디 읽고 있었지? PDF와 번역창을 번갈아 보느라 놓쳤어"
            <br /> 고민할 필요 없어요.
            <br /> 문장단위 번역으로 왕복 시간을 아껴드릴게요.
          </p>
          <MainImage className={styles.image} />
          <div className={styles.overlay} />
        </div>
      </div>
    </section>
  );
}
