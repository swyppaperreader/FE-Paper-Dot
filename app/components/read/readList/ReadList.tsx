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
  const [data] = useState<TranslationPair[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem("translationPairs");
      return stored ? (JSON.parse(stored) as TranslationPair[]) : [];
    } catch {
      return [];
    }
  });

  const [fileName] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("fileName") ?? "";
  });

  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  const selectedItem = data[selectedPageIndex];

  return (
    <main className={styles.container}>
      <ReadHeader fileName={fileName} />
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <ul className={styles.pageList}>
            {data.map((item, index) => (
              <li key={item.docUnitId} className={styles.pageListItem}>
                <button
                  type="button"
                  className={`${styles.pageCard} ${
                    index === selectedPageIndex ? styles.pageCardSelected : ""
                  }`}
                  onClick={() => setSelectedPageIndex(index)}
                  aria-pressed={index === selectedPageIndex}>
                  <span className={styles.pagePreview} />
                  <span className={styles.pageNumber}>{index + 1}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className={styles.docUnitId}>
          {selectedItem && (
            <div className={styles.docUnitIdItem}>
              <p className={styles.sourceText}>{selectedItem.sourceText}</p>
              <p className={styles.translatedText}>
                {selectedItem.translatedText}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
