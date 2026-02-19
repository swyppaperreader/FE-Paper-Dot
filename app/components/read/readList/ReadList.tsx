"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReadHeader from "../../header/ReadHeader";
import styles from "./readList.module.css";
interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

/** 페이지당 문장(항목) 수 (7~8문장 단위) */
const ITEMS_PER_PAGE = 8;

export default function ReadList() {
  const [data] = useState<TranslationPair[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem("translationPairs");
      if (stored) {
        const parsed = JSON.parse(stored) as TranslationPair[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  });

  const [fileName] = useState(() => {
    if (typeof window === "undefined") return "";
    const stored = sessionStorage.getItem("fileName");
    return stored?.trim() ?? "";
  });

  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "korean" | "english">(
    "all"
  );

  // 파생 값: 7~8문장 단위로 페이지 묶음
  const dataToPage = useMemo(
    () =>
      data.length === 0
        ? []
        : data.map((_, i) => Math.floor(i / ITEMS_PER_PAGE) + 1),
    [data]
  );
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
  const pageToFirstIdx = useMemo(() => {
    const p2i = new Map<number, number>();
    for (let p = 1; p <= totalPages; p++) {
      p2i.set(p, (p - 1) * ITEMS_PER_PAGE);
    }
    return p2i;
  }, [totalPages]);

  const BOOKMARKS_KEY = "paper-dot-bookmarks";
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const documentId = sessionStorage.getItem("documentId") ?? "";
      const stored = localStorage.getItem(`${BOOKMARKS_KEY}-${documentId}`);
      if (stored) {
        const arr = JSON.parse(stored) as number[];
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch {
      /* ignore */
    }
    return new Set();
  });

  useEffect(() => {
    const documentId = sessionStorage.getItem("documentId") ?? "";
    localStorage.setItem(
      `${BOOKMARKS_KEY}-${documentId}`,
      JSON.stringify([...bookmarkedIds])
    );
  }, [bookmarkedIds]);

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ─── 스크롤 → 현재 페이지 감지 ───
  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el || dataToPage.length === 0) return;

    // 페이지 경계: 각 페이지의 첫 번째 항목 index (오름차순)
    const boundaries: { pageNum: number; dataIdx: number }[] = [];
    const seen = new Set<number>();
    for (let i = 0; i < dataToPage.length; i++) {
      const p = dataToPage[i];
      if (!seen.has(p)) {
        seen.add(p);
        boundaries.push({ pageNum: p, dataIdx: i });
      }
    }
    if (boundaries.length === 0) return;

    let rafId = 0;

    const detect = () => {
      const scrollTop = el.scrollTop;

      // 역순 탐색: scrollTop이 해당 항목의 offsetTop을 지났으면 그 페이지
      let currentPage = boundaries[0].pageNum;
      for (let b = boundaries.length - 1; b >= 0; b--) {
        const ref = itemRefs.current[boundaries[b].dataIdx];
        if (!ref) continue;
        // offsetTop = 항목의 스크롤 컨테이너(position:relative) 기준 위치
        if (scrollTop + 60 >= ref.offsetTop) {
          currentPage = boundaries[b].pageNum;
          break;
        }
      }

      setSelectedPageIndex(currentPage - 1);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        detect();
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    detect(); // 초기 상태
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [dataToPage]);

  // ─── 6. 페이지 이동 ───
  const scrollToPage = useCallback(
    (pageIndex: number) => {
      const pageNum = pageIndex + 1;
      const dataIdx = pageToFirstIdx.get(pageNum);

      if (dataIdx !== undefined && itemRefs.current[dataIdx]) {
        const el = contentScrollRef.current;
        const target = itemRefs.current[dataIdx];
        if (el && target) {
          // scrollIntoView 대신 직접 계산 (스크롤 컨테이너 내부 정확한 위치)
          const containerRect = el.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const offset = targetRect.top - containerRect.top + el.scrollTop;
          el.scrollTo({ top: offset, behavior: "smooth" });
        }
        setSelectedPageIndex(pageIndex);
        return;
      }

      // 폴백
      const el = contentScrollRef.current;
      if (el) {
        el.scrollTo({ top: pageIndex * el.clientHeight, behavior: "smooth" });
      }
      setSelectedPageIndex(pageIndex);
    },
    [pageToFirstIdx]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const pageIndex = Math.max(0, Math.min(page - 1, totalPages - 1));
      scrollToPage(pageIndex);
    },
    [totalPages, scrollToPage]
  );

  const handleToggleSidebar = () => setShowSidebar((prev) => !prev);
  const handleFilterChange = (mode: "all" | "korean" | "english") =>
    setFilterMode(mode);

  // ─── 렌더링 ───
  return (
    <main className={styles.container}>
      <ReadHeader
        fileName={fileName}
        currentPage={selectedPageIndex + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onToggleSidebar={handleToggleSidebar}
        filterMode={filterMode}
        onFilterChange={handleFilterChange}
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
                    <div className={styles.pagePreview}>
                      {(() => {
                        const firstIdx = index * ITEMS_PER_PAGE;
                        const item = data[firstIdx];
                        if (!item) {
                          return (
                            <div className={styles.pagePreviewPlaceholder} />
                          );
                        }
                        const pageItems = data.slice(
                          firstIdx,
                          firstIdx + ITEMS_PER_PAGE
                        );
                        const previewText = pageItems
                          .map((x) => x.translatedText)
                          .join(" ");
                        const prevSourceText = pageItems
                          .map((x) => x.sourceText)
                          .join(" ");
                        return (
                          <div
                            className={styles.pagePreviewText}
                            title={previewText}>
                            <p className={styles.pagePreviewTextSourceText}>
                              {prevSourceText || " "}
                            </p>
                            <p className={styles.pagePreviewTextText}>
                              {previewText || " "}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
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
            <div key={item.docUnitId}>
              {filterMode === "all" && (
                <>
                  <p className={styles.sourceText}>{item.sourceText}</p>
                  <p className={styles.translatedText}>{item.translatedText}</p>
                </>
              )}
              {filterMode === "english" && (
                <p className={styles.sourceText}>{item.sourceText}</p>
              )}
              {filterMode === "korean" && (
                <p className={styles.translatedText}>{item.translatedText}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
