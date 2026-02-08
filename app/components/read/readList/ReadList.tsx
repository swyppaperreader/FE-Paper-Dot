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
      const pages =
        clientHeight >= scrollHeight
          ? 1
          : Math.floor((scrollHeight - clientHeight) / clientHeight) + 1;
      // 스크롤로 이미 늘어난 페이지 수는 유지
      setTotalPages((prev) => Math.max(prev, Math.max(1, pages)));
    };

    updateTotalPages();
    const ro = new ResizeObserver(updateTotalPages);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  // 스크롤 시 현재 페이지 갱신 + 끝까지 넘어가면 페이지 하나 추가
  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, clientHeight } = el;
      const pageIndex = Math.floor(scrollTop / clientHeight);
      setTotalPages((prev) => Math.max(prev, pageIndex + 1));
      setSelectedPageIndex(pageIndex);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPage = (pageIndex: number) => {
    const el = contentScrollRef.current;
    if (!el) return;
    const pageHeight = el.clientHeight;
    el.scrollTo({ top: pageIndex * pageHeight, behavior: "smooth" });
  };

  console.log(totalPages);

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
                  <span className={styles.pageNumber}>
                    {Math.min(index + 1, totalPages)}
                  </span>
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
