import Link from "next/link";
import styles from "./readHeader.module.css";
import HeaderModal from "../modal/HeaderModal";
import Image from "next/image";
import Button from "@/app/components/button/Button";
import HeaderToggle from "./toggle/headerToggle";

export default function ReadHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={"/"} className={styles.link}>
          {/* 로고 이미지 자리 */}
          <div className={styles.logo}></div>
          Paperdot.
        </Link>
        <Button className={styles.readHeaderUserImageButton} onClick={() => {}}>
          <Image src="/slide.svg" alt="slider" width={24} height={24} />
        </Button>
        <div className={styles.readHeaderPageNumber}>
          <div className={styles.readHeaderPageNumberPageContainer}>
            <p className={styles.readHeaderPageNumberPage}>2</p>
          </div>
          <p className={styles.readHeaderPageNumberTotal}>/ 20</p>
        </div>
        <p className={styles.readHeaderFileName}>file_title</p>
        <HeaderToggle />
        <HeaderModal isReadHeader={true} className={styles.readHeaderModal} />
      </div>
    </header>
  );
}
