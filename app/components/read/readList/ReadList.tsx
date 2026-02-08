"use client";

import { useState, useRef, useEffect } from "react";
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
  const [totalPages, setTotalPages] = useState(1);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 영역 높이 기준으로 전체 페이지 수 계산
  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el || data.length === 0) return;

    const updateTotalPages = () => {
      const { scrollHeight, clientHeight } = el;

      const maxScrollTop = scrollHeight - clientHeight;
      const pages =
        maxScrollTop <= 0 ? 1 : Math.floor(maxScrollTop / clientHeight) + 1;

      setTotalPages(pages);
    };

    updateTotalPages();

    const ro = new ResizeObserver(updateTotalPages);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  // 스크롤 시 현재 페이지 인덱스 갱신 (한 화면 = 1페이지)
  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, clientHeight } = el;
      const pageIndex = Math.min(
        totalPages - 1,
        Math.floor(scrollTop / clientHeight)
      );
      setSelectedPageIndex(pageIndex);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalPages]);

  const scrollToPage = (pageIndex: number) => {
    const el = contentScrollRef.current;
    if (!el) return;
    const pageHeight = el.clientHeight;
    el.scrollTo({ top: pageIndex * pageHeight, behavior: "smooth" });
  };

  return (
    <main className={styles.container}>
      <ReadHeader fileName={fileName} />
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <ul className={styles.pageList}>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index} className={styles.pageListItem}>
                <button
                  type="button"
                  className={`${styles.pageCard} ${
                    index === selectedPageIndex ? styles.pageCardSelected : ""
                  }`}
                  onClick={() => scrollToPage(index)}
                  aria-pressed={index === selectedPageIndex}>
                  <span className={styles.pagePreview} />
                  <span className={styles.pageNumber}>{index + 1}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div
          ref={contentScrollRef}
          className={styles.docUnitId}
          role="region"
          aria-label="문서 본문">
          {data.map((item) => (
            <div className={styles.docUnitIdItem} key={item.docUnitId}>
              <p className={styles.sourceText}>{item.sourceText}</p>
              <p className={styles.translatedText}>{item.translatedText}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
