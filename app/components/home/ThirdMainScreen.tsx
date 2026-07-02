import styles from "@/app/components/home/thirdMainScreen.module.css";
import Image from "next/image";
import { thirdMainScreenBlocks } from "@/app/constants/mainConsts";

export default function ThirdMainScreen() {
  return (
    <section className={styles.container}>
      {thirdMainScreenBlocks.map((block) => {
        const textBoxClass =
          block.layout === "text-image"
            ? styles.contentLeftBox
            : styles.contentRightCenter;

        const textCol = (
          <div className={textBoxClass}>
            <h1 className={styles.title}>{block.title}</h1>
            <p className={styles.description}>
              {block.descriptionLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        );

        const imageCol = (
          <div
            className={styles.contentRight}
            style={{ aspectRatio: block.aspectRatio }}>
            <Image
              src={block.imageSrc}
              alt={block.imageAlt}
              fill
              className={styles.contentRightImage}
            />
          </div>
        );

        return (
          <div key={block.id} className={styles.content}>
            {block.layout === "text-image" ? (
              <>
                {textCol}
                {imageCol}
              </>
            ) : (
              <>
                {imageCol}
                {textCol}
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
