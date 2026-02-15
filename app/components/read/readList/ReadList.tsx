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
  const [showSidebar, setShowSidebar] = useState(true);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el || data.length === 0) return;

    const updateTotalPages = () => {
      const { scrollHeight, clientHeight } = el;

      const maxScrollTop = scrollHeight - clientHeight;
      const threshold = clientHeight * 0.15;

      const pages =
        maxScrollTop <= 0
          ? 1
          : Math.floor((maxScrollTop + threshold) / clientHeight) + 1;

      setTotalPages((prev) => (prev === pages ? prev : pages));
    };

    updateTotalPages();

    const ro = new ResizeObserver(() => {
      // 🔒 스크롤 중 연쇄 방지
      requestAnimationFrame(updateTotalPages);
    });

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

  const handlePageChange = (page: number) => {
    const pageIndex = Math.max(0, Math.min(page - 1, totalPages - 1));
    scrollToPage(pageIndex);
    setSelectedPageIndex(pageIndex);
  };

  const handleToggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <main className={styles.container}>
      <ReadHeader
        fileName={fileName}
        currentPage={selectedPageIndex + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className={styles.content}>
        {showSidebar && (
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
        )}
        <div
          ref={contentScrollRef}
          className={styles.docUnitId}
          role="region"
          aria-label="문서 본문"
          style={showSidebar ? {} : { width: "100%" }}>
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
