"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import ReadHeader from "../../header/ReadHeader";
import styles from "./readList.module.css";
import { getDocumentDetail } from "@/app/services/document";
import { useAccessTokenStore } from "@/app/store/useLogin";
interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

// 테스트용 샘플 데이터 (페이지 1: 1~5, 페이지 2: 6~10)
const SAMPLE_DATA: TranslationPair[] = [
  {
    docUnitId: 1,
    sourceText: "This is the test pdf.",
    translatedText: "이것은 테스트 PDF입니다.",
  },
  {
    docUnitId: 2,
    sourceText: "You can do it!",
    translatedText: "할 수 있어요!",
  },
  {
    docUnitId: 3,
    sourceText:
      "Despite these advances, concerns about the negative effects of technology on education have emerged.",
    translatedText:
      "이러한 발전에도 불구하고, 교육에 대한 기술의 부정적인 영향에 대한 우려가 제기되었다.",
  },
  {
    docUnitId: 4,
    sourceText:
      "Excessive screen time can lead to eye strain and fatigue, reducing the effectiveness of learning.",
    translatedText:
      "과도한 화면 노출은 눈의 피로와 피곤함을 초래할 수 있으며, 학습의 효과를 감소시킨다.",
  },
  {
    docUnitId: 5,
    sourceText:
      "Furthermore, the constant connectivity brought about by digital devices may encourage procrastination and reduce concentration.",
    translatedText:
      "더욱이, 디지털 기기가 가져온 지속적인 연결성은 미루는 습관을 조장하고 집중력을 감소시킬 수 있다.",
  },
  {
    docUnitId: 6,
    sourceText:
      "Students often find themselves distracted by social media and other online content, making it difficult to maintain focus on their studies.",
    translatedText:
      "학생들은 종종 소셜 미디어와 다른 온라인 콘텐츠로 인해 산만해지며, 자신의 학습에 집중을 유지하기 어렵다.",
  },
  {
    docUnitId: 7,
    sourceText:
      "Additionally, the digital divide—the gap between those with access to technology and those without—continues to create inequalities in educational opportunities.",
    translatedText:
      "또한, 기술에 접근할 수 있는 사람들과 그렇지 못한 사람들 사이의 격차인 디지털 격차는 계속해서 교육 기회의 불평등을 만든다.",
  },
  {
    docUnitId: 8,
    sourceText:
      "While technology offers tremendous potential, it is crucial to find a balance between digital learning and traditional methods.",
    translatedText:
      "기술은 엄청난 잠재력을 제공하지만, 디지털 학습과 전통적인 방법 사이의 균형을 찾는 것이 중요하다.",
  },
  {
    docUnitId: 9,
    sourceText:
      "Educators must develop strategies to minimize distractions and ensure that technology enhances rather than hinders the learning process.",
    translatedText:
      "교육자들은 산만함을 최소화하고 기술이 학습 과정을 방해하기보다 개선하도록 보장하는 전략을 개발해야 한다.",
  },
  {
    docUnitId: 10,
    sourceText:
      "In conclusion, technology is a powerful tool that can significantly improve education when used properly.",
    translatedText:
      "결론적으로, 기술은 올바르게 사용될 때 교육을 크게 개선할 수 있는 강력한 도구이다.",
  },
];

// 샘플 데이터용 페이지 매핑 (페이지 1: index 0~4, 페이지 2: index 5~9)
const SAMPLE_DATA_TO_PAGE = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2];

const SAMPLE_FILE_NAME = "This is the test pdf.pdf";

/** 텍스트 정규화: 소문자 + 영숫자/공백만 남김 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ReadList() {
  const [data] = useState<TranslationPair[]>(() => {
    if (typeof window === "undefined") return SAMPLE_DATA;
    try {
      const stored = sessionStorage.getItem("translationPairs");
      if (stored) {
        const parsed = JSON.parse(stored) as TranslationPair[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return SAMPLE_DATA;
    } catch {
      return SAMPLE_DATA;
    }
  });

  const [isSampleMode] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = sessionStorage.getItem("translationPairs");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return false;
      } catch {
        /* ignore */
      }
    }
    return true;
  });

  const [fileName] = useState(() => {
    if (typeof window === "undefined") return SAMPLE_FILE_NAME;
    const stored = sessionStorage.getItem("fileName");
    if (stored && stored.trim() !== "") return stored;
    return SAMPLE_FILE_NAME;
  });

  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "korean" | "english">(
    "all"
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfDocument, setPdfDocument] = useState<
    import("pdfjs-dist").PDFDocumentProxy | null
  >(null);
  const [pageImages, setPageImages] = useState<Map<number, string>>(new Map());

  // 핵심 매핑: 각 data index → 소속 페이지(1-based)
  const [dataToPage, setDataToPage] = useState<number[]>([]);
  // 페이지(1-based) → 해당 페이지 첫 data index
  const [pageToFirstIdx, setPageToFirstIdx] = useState<Map<number, number>>(
    new Map()
  );

  const BOOKMARKS_KEY = "paper-dot-bookmarks";
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const documentId = sessionStorage.getItem("documentId") ?? "sample";
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
    const documentId = sessionStorage.getItem("documentId") ?? "sample";
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
  const accessToken = useAccessTokenStore((state) => state.accessToken);

  // ─── 1. 샘플 모드: PDF 없이 바로 매핑 설정 ───
  useEffect(() => {
    if (!isSampleMode) return;
    const d2p = SAMPLE_DATA_TO_PAGE.slice(0, data.length);
    // 전체 항목에 대해 페이지 할당이 안 된 경우 보정
    while (d2p.length < data.length) d2p.push(d2p[d2p.length - 1] ?? 1);

    const maxPage = Math.max(...d2p);
    setTotalPages(maxPage);
    setDataToPage(d2p);

    const p2i = new Map<number, number>();
    for (let i = 0; i < d2p.length; i++) {
      if (!p2i.has(d2p[i])) p2i.set(d2p[i], i);
    }
    setPageToFirstIdx(p2i);
  }, [isSampleMode, data]);

  // ─── 2. PDF 로드 ───
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdfDataUrl = sessionStorage.getItem("pdfFileData");
        let pdf: import("pdfjs-dist").PDFDocumentProxy | null = null;

        if (pdfDataUrl) {
          const base64 = pdfDataUrl.split(",")[1];
          const bin = atob(base64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        } else if (pdfUrl) {
          pdf = await pdfjsLib.getDocument({
            url: pdfUrl,
            withCredentials: true,
          }).promise;
        }

        if (!pdf) return;
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
      } catch (error) {
        console.warn("PDF 로드 실패:", error);
      }
    };

    if (!isSampleMode) loadPdf();
  }, [pdfUrl, isSampleMode]);

  // ─── 3. PDF 썸네일 렌더링 ───
  useEffect(() => {
    const renderPages = async () => {
      if (!pdfDocument) return;
      const numPages = pdfDocument.numPages;
      const images = new Map<number, string>();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
          const page = await pdfDocument.getPage(pageNum);
          const vp = page.getViewport({ scale: 1.0 });
          const scale = 216 / vp.width; // 108 * 2 레티나
          const scaled = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = scaled.width;
          canvas.height = scaled.height;
          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) continue;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvas, canvasContext: ctx, viewport: scaled })
            .promise;
          images.set(pageNum, canvas.toDataURL("image/png"));
        } catch (e) {
          console.warn(`페이지 ${pageNum} 렌더링 실패:`, e);
        }
      }
      setPageImages(images);
    };

    renderPages();
  }, [pdfDocument]);

  // ─── 4. PDF 텍스트 추출 → 번역 항목 매핑 ───
  useEffect(() => {
    const buildMapping = async () => {
      if (!pdfDocument || isSampleMode || data.length === 0) return;
      const numPages = pdfDocument.numPages;

      // 4-1. 각 페이지 텍스트 추출
      const pageTexts: string[] = [];
      for (let p = 1; p <= numPages; p++) {
        const page = await pdfDocument.getPage(p);
        const tc = await page.getTextContent();
        const raw = tc.items.map((it) => ("str" in it ? it.str : "")).join(" ");
        pageTexts.push(normalize(raw));
      }

      // 4-2. 각 항목을 페이지에 매칭
      const assigned = new Array<number>(data.length).fill(0);

      for (let i = 0; i < data.length; i++) {
        const src = normalize(data[i].sourceText);
        if (!src) continue;

        // 전략 1: 연속 단어 3~5개로 검색 (가장 정확)
        const words = src.split(" ").filter(Boolean);
        let found = false;

        for (
          let wLen = Math.min(5, words.length);
          wLen >= 3 && !found;
          wLen--
        ) {
          const phrase = words.slice(0, wLen).join(" ");
          for (let p = 0; p < pageTexts.length; p++) {
            if (pageTexts[p].includes(phrase)) {
              assigned[i] = p + 1;
              found = true;
              break;
            }
          }
        }

        // 전략 2: 단어 1~2개라면 전체 문자열로 검색
        if (!found && words.length > 0) {
          const phrase = words.slice(0, Math.min(2, words.length)).join(" ");
          for (let p = 0; p < pageTexts.length; p++) {
            if (pageTexts[p].includes(phrase)) {
              assigned[i] = p + 1;
              found = true;
              break;
            }
          }
        }
      }

      // 4-3. 매칭 안 된 항목 보정: 이전 항목과 같은 페이지
      for (let i = 0; i < assigned.length; i++) {
        if (assigned[i] === 0) {
          assigned[i] = i > 0 ? assigned[i - 1] : 1;
        }
      }

      // 4-4. state 반영
      setDataToPage(assigned);
      const p2i = new Map<number, number>();
      for (let i = 0; i < assigned.length; i++) {
        if (!p2i.has(assigned[i])) p2i.set(assigned[i], i);
      }
      setPageToFirstIdx(p2i);
    };

    buildMapping().catch(console.error);
  }, [pdfDocument, isSampleMode, data]);

  // ─── 5. 스크롤 → 현재 페이지 감지 ───
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

  // ─── 7. PDF URL 가져오기 ───
  useEffect(() => {
    if (isSampleMode) return;
    const fetchPdfUrl = async () => {
      try {
        const documentId = sessionStorage.getItem("documentId");
        if (!documentId) return;

        const detail = await getDocumentDetail(
          documentId,
          accessToken ?? undefined
        );
        if (detail.storagePath) {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "https://be-paper-dot.store";
          const url = detail.storagePath.startsWith("http")
            ? detail.storagePath
            : `${apiUrl}${detail.storagePath.startsWith("/") ? "" : "/"}${
                detail.storagePath
              }`;
          setPdfUrl(url);
        }
      } catch (error) {
        console.warn("PDF URL 가져오기 실패:", error);
      }
    };
    fetchPdfUrl();
  }, [accessToken, isSampleMode]);

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
                      <img
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
