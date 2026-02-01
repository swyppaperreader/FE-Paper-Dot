import Link from "next/link";
import styles from "./readHeader.module.css";
import HeaderModal from "../modal/HeaderModal";
import HeaderLogo from "@/public/Logo.svg";
import Button from "@/app/components/button/Button";
import HeaderToggle from "./toggle/headerToggle";
import SlideIcon from "@/public/slide.svg";

export default function ReadHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={"/"} className={styles.link}>
          <HeaderLogo />
        </Link>
        <Button className={styles.readHeaderUserImageButton} onClick={() => {}}>
          <SlideIcon />
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
