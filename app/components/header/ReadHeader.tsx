"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./readHeader.module.css";
import HeaderModal from "../modal/HeaderModal";
import HeaderToggle from "./toggle/headerToggle";

export default function ReadHeader({ fileName }: { fileName: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={"/"} className={styles.link}>
          <Image src="/Logo.svg" alt="Paperdot" width={106} height={40} />
        </Link>
        {fileName && <p className={styles.readHeaderFileName}>{fileName}</p>}
        <HeaderToggle />
        <HeaderModal isReadHeader={true} className={styles.readHeaderModal} />
      </div>
    </header>
  );
}
