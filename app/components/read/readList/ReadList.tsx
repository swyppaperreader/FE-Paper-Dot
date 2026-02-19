"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
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

  // 파생 값: data 기준으로 렌더 시 계산 (effect 내 setState 제거)
  const dataToPage = useMemo(
    () => (data.length === 0 ? [] : data.map((_, i) => i + 1)),
    [data]
  );
  const totalPages = data.length || 1;
  const pageToFirstIdx = useMemo(() => {
    const p2i = new Map<number, number>();
    dataToPage.forEach((pageNum, i) => {
      if (!p2i.has(pageNum)) p2i.set(pageNum, i);
    });
    return p2i;
  }, [dataToPage]);
  const pageImages = useMemo(() => new Map<number, string>(), []);

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

  const toggleBookmark = useCallback((docUnitId: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(docUnitId)) next.delete(docUnitId);
      else next.add(docUnitId);
      return next;
    });
  }, []);

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
                      {pageImages.has(index + 1) ? (
                        <Image
                          src={pageImages.get(index + 1) || ""}
                          alt={`Page ${index + 1}`}
                          width={108}
                          height={140}
                          className={styles.pageThumbImage}
                          unoptimized
                        />
                      ) : (
                        <div className={styles.pagePreviewPlaceholder} />
                      )}
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
          {data.map((item, index) => {
            // 이전 항목과 페이지가 다르면 구분선 표시 (첫 항목 제외)
            const showDivider =
              dataToPage.length > 0 &&
              index > 0 &&
              dataToPage[index] !== dataToPage[index - 1];

            return (
              <div key={item.docUnitId}>
                {showDivider && (
                  <div className={styles.pageDivider}>
                    Page {dataToPage[index]}
                  </div>
                )}
                <div
                  className={`${styles.docUnitIdItem} ${
                    bookmarkedIds.has(item.docUnitId)
                      ? styles.docUnitIdItemBookmarked
                      : ""
                  }`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleBookmark(item.docUnitId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleBookmark(item.docUnitId);
                    }
                  }}
                  aria-pressed={bookmarkedIds.has(item.docUnitId)}
                  aria-label={
                    bookmarkedIds.has(item.docUnitId)
                      ? "북마크 해제"
                      : "북마크 추가"
                  }>
                  {bookmarkedIds.has(item.docUnitId) && (
                    <>
                      <Image
                        src="/Bookmark.svg"
                        alt=""
                        width={24}
                        height={24}
                        className={styles.bookmarkIcon}
                      />
                    </>
                  )}
                  {filterMode === "all" && (
                    <>
                      <p className={styles.sourceText}>{item.sourceText}</p>
                      <p className={styles.translatedText}>
                        {item.translatedText}
                      </p>
                    </>
                  )}
                  {filterMode === "english" && (
                    <p className={styles.sourceText}>{item.sourceText}</p>
                  )}
                  {filterMode === "korean" && (
                    <p className={styles.translatedText}>
                      {item.translatedText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
