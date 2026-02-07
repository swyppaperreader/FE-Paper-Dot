import Link from "next/link";
import Image from "next/image";
import styles from "./readHeader.module.css";
import HeaderModal from "../modal/HeaderModal";
import Button from "@/app/components/button/Button";
import HeaderToggle from "./toggle/headerToggle";

export default function ReadHeader({ fileName }: { fileName: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={"/"} className={styles.link}>
          <Image src="/Logo.svg" alt="Paperdot" width={106} height={40} />
        </Link>
        <Button className={styles.readHeaderUserImageButton} onClick={() => {}}>
          <Image src="/slide.svg" alt="slide" width={24} height={24} />
        </Button>
        <div className={styles.readHeaderPageNumber}>
          <div className={styles.readHeaderPageNumberPageContainer}>
            <p className={styles.readHeaderPageNumberPage}>2</p>
          </div>
          <p className={styles.readHeaderPageNumberTotal}>/ 20</p>
        </div>
        <p className={styles.readHeaderFileName}>{fileName}</p>
        <HeaderToggle />
        <HeaderModal isReadHeader={true} className={styles.readHeaderModal} />
      </div>
    </header>
  );
}
