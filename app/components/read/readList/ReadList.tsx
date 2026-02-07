"use client";

import { useState } from "react";
import ReadHeader from "../../header/ReadHeader";
import styles from "./readList.module.css";

interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

export default function ReadList() {
  const [data] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("translationPairs");
    return stored ? JSON.parse(stored) : [];
  });

  const [fileName] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("fileName") ?? "";
  });

  console.log("data", data);
  console.log(fileName);

  return (
    <main className={styles.container}>
      <ReadHeader fileName={fileName} />
      <div className={styles.content}>
        <aside className={styles.sidebar}></aside>
        {data.map((item: TranslationPair) => (
          <div className={styles.docUnitId} key={item.docUnitId}>
            <p className={styles.sourceText}>{item.sourceText}</p>
            <p className={styles.translatedText}>{item.translatedText}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
