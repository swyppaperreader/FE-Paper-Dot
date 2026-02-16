"use client";

import { useState, useRef, useEffect } from "react";
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

// 테스트용 샘플 데이터
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
    sourceText: "Despite these advances, concerns about the negative effects of technology on education have emerged.",
    translatedText: "이러한 발전에도 불구하고, 교육에 대한 기술의 부정적인 영향에 대한 우려가 제기되었다.",
  },
  {
    docUnitId: 4,
    sourceText: "Excessive screen time can lead to eye strain and fatigue, reducing the effectiveness of learning.",
    translatedText: "과도한 화면 노출은 눈의 피로와 피곤함을 초래할 수 있으며, 학습의 효과를 감소시킨다.",
  },
  {
    docUnitId: 5,
    sourceText: "Furthermore, the constant connectivity brought about by digital devices may encourage procrastination and reduce concentration.",
    translatedText: "더욱이, 디지털 기기가 가져온 지속적인 연결성은 미루는 습관을 조장하고 집중력을 감소시킬 수 있다.",
  },
  {
    docUnitId: 6,
    sourceText: "Students often find themselves distracted by social media and other online content, making it difficult to maintain focus on their studies.",
    translatedText: "학생들은 종종 소셜 미디어와 다른 온라인 콘텐츠로 인해 산만해지며, 자신의 학습에 집중을 유지하기 어렵다.",
  },
  {
    docUnitId: 7,
    sourceText: "Additionally, the digital divide—the gap between those with access to technology and those without—continues to create inequalities in educational opportunities.",
    translatedText: "또한, 기술에 접근할 수 있는 사람들과 그렇지 못한 사람들 사이의 격차인 디지털 격차는 계속해서 교육 기회의 불평등을 만든다.",
  },
  {
    docUnitId: 8,
    sourceText: "While technology offers tremendous potential, it is crucial to find a balance between digital learning and traditional methods.",
    translatedText: "기술은 엄청난 잠재력을 제공하지만, 디지털 학습과 전통적인 방법 사이의 균형을 찾는 것이 중요하다.",
  },
  {
    docUnitId: 9,
    sourceText: "Educators must develop strategies to minimize distractions and ensure that technology enhances rather than hinders the learning process.",
    translatedText: "교육자들은 산만함을 최소화하고 기술이 학습 과정을 방해하기보다 개선하도록 보장하는 전략을 개발해야 한다.",
  },
  {
    docUnitId: 10,
    sourceText: "In conclusion, technology is a powerful tool that can significantly improve education when used properly.",
    translatedText: "결론적으로, 기술은 올바르게 사용될 때 교육을 크게 개선할 수 있는 강력한 도구이다.",
  },
];

const SAMPLE_FILE_NAME = "This is the test pdf.pdf";

export default function ReadList() {
  const [data] = useState<TranslationPair[]>(() => {
    if (typeof window === "undefined") return SAMPLE_DATA;
    try {
      const stored = sessionStorage.getItem("translationPairs");
      // sessionStorage에 실제 데이터가 있으면 우선 사용 (배포 환경에서 파일 업로드 시)
      if (stored) {
        const parsed = JSON.parse(stored) as TranslationPair[];
        // 실제 데이터가 있고 유효하면 실제 데이터 사용
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // 실제 데이터가 없을 때만 샘플 데이터 사용 (로컬 테스트용)
      return SAMPLE_DATA;
    } catch (error) {
      console.warn("Failed to parse translationPairs from sessionStorage:", error);
      // 파싱 실패 시 샘플 데이터 사용
      return SAMPLE_DATA;
    }
  });

  const [fileName] = useState(() => {
    if (typeof window === "undefined") return SAMPLE_FILE_NAME;
    const stored = sessionStorage.getItem("fileName");
    // sessionStorage에 실제 파일명이 있으면 우선 사용
    if (stored && stored.trim() !== "") {
      return stored;
    }
    // 실제 파일명이 없을 때만 샘플 파일명 사용
    return SAMPLE_FILE_NAME;
  });

  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "korean" | "english">("all");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [actualPdfPages, setActualPdfPages] = useState<number | null>(null);
  const [pdfDocument, setPdfDocument] = useState<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const [pageImages, setPageImages] = useState<Map<number, string>>(new Map());
  // PDF 페이지 번호(1-based) → 해당 페이지 첫 번째 data 인덱스(0-based)
  const [pageToDataIndex, setPageToDataIndex] = useState<Map<number, number>>(new Map());
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accessToken = useAccessTokenStore((state) => state.accessToken);

  // 실제 PDF 문서 로드 및 페이지 수 가져오기
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        // 1순위: sessionStorage에 저장된 PDF 데이터 사용
        const pdfDataUrl = sessionStorage.getItem("pdfFileData");
        let pdf: import("pdfjs-dist").PDFDocumentProxy | null = null;

        if (pdfDataUrl) {
          const base64 = pdfDataUrl.split(",")[1];
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        } else if (pdfUrl) {
          // 2순위: 서버 URL에서 로드
          pdf = await pdfjsLib.getDocument({
            url: pdfUrl,
            withCredentials: true,
          }).promise;
        }

        if (!pdf) return;

        setPdfDocument(pdf);
        setActualPdfPages(pdf.numPages);
        setTotalPages(pdf.numPages);
      } catch (error) {
        console.warn("PDF 문서를 로드하는데 실패했습니다:", error);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  // 각 페이지를 이미지로 렌더링
  useEffect(() => {
    const renderPages = async () => {
      if (!pdfDocument || !actualPdfPages) return;

      try {
        const newPageImages = new Map<number, string>();

        for (let pageNum = 1; pageNum <= actualPdfPages; pageNum++) {
          try {
            const page = await pdfDocument.getPage(pageNum);

            // 썸네일 해상도를 위해 2배 스케일로 렌더링
            const viewport = page.getViewport({ scale: 1.0 });
            const thumbWidth = 216; // 108 * 2 (레티나 대응)
            const scale = thumbWidth / viewport.width;
            const scaledViewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            const context = canvas.getContext("2d", { alpha: false });
            if (!context) continue;

            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);

            await page.render({
              canvas,
              canvasContext: context,
              viewport: scaledViewport,
            }).promise;

            newPageImages.set(pageNum, canvas.toDataURL("image/png"));
          } catch (error) {
            console.warn(`페이지 ${pageNum} 렌더링 실패:`, error);
          }
        }

        setPageImages(newPageImages);
      } catch (error) {
        console.error("PDF 페이지 렌더링 중 오류:", error);
      }
    };

    renderPages();
  }, [pdfDocument, actualPdfPages]);

  // PDF 페이지별 텍스트 추출 → 번역 항목 매핑
  useEffect(() => {
    const buildPageMapping = async () => {
      if (!pdfDocument || !actualPdfPages || data.length === 0) return;

      try {
        // 각 페이지의 텍스트를 추출
        const pageTexts: string[] = [];
        for (let pageNum = 1; pageNum <= actualPdfPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          const text = textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ")
            .replace(/\s+/g, " ")
            .toLowerCase();
          pageTexts.push(text);
        }

        // 각 번역 항목의 sourceText가 어느 페이지에 속하는지 매칭
        const mapping = new Map<number, number>();
        const assigned = new Array<number>(data.length).fill(0);

        for (let i = 0; i < data.length; i++) {
          // sourceText에서 검색용 키워드 추출 (앞 40자 정도)
          const source = data[i].sourceText.replace(/\s+/g, " ").toLowerCase();
          const searchKey = source.slice(0, 40).trim();
          if (!searchKey) continue;

          for (let p = 0; p < pageTexts.length; p++) {
            if (pageTexts[p].includes(searchKey)) {
              assigned[i] = p + 1; // 1-based page number
              break;
            }
          }
        }

        // 매칭 안 된 항목은 이전 항목과 같은 페이지로 보정
        for (let i = 0; i < assigned.length; i++) {
          if (assigned[i] === 0 && i > 0) {
            assigned[i] = assigned[i - 1];
          }
          if (assigned[i] === 0) {
            assigned[i] = 1;
          }
        }

        // 페이지별 첫 번째 data 인덱스 기록
        for (let i = 0; i < assigned.length; i++) {
          const pageNum = assigned[i];
          if (!mapping.has(pageNum)) {
            mapping.set(pageNum, i);
          }
        }

        setPageToDataIndex(mapping);
      } catch (error) {
        console.warn("페이지-텍스트 매핑 실패:", error);
      }
    };

    buildPageMapping();
  }, [pdfDocument, actualPdfPages, data]);

  // 실제 PDF 페이지 수가 없을 때만 스크롤 기반 페이지 계산 (폴백)
  useEffect(() => {
    if (actualPdfPages !== null) return; // 실제 PDF 페이지 수가 있으면 스킵

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
      requestAnimationFrame(updateTotalPages);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [data, actualPdfPages]);

  // 스크롤 시 현재 페이지 인덱스 갱신 (보이는 첫 항목 기준)
  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el || pageToDataIndex.size === 0) return;

    // data index → page number 역매핑 생성
    const dataIndexToPage = new Map<number, number>();
    pageToDataIndex.forEach((dataIdx, pageNum) => {
      dataIndexToPage.set(dataIdx, pageNum);
    });
    // 모든 data index에 대해 소속 페이지 채우기
    const sortedEntries = Array.from(pageToDataIndex.entries()).sort((a, b) => a[1] - b[1]);

    const onScroll = () => {
      const scrollTop = el.scrollTop;
      // 현재 보이는 첫 번째 항목 찾기
      let visibleIdx = 0;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const ref = itemRefs.current[i];
        if (ref && ref.offsetTop + ref.offsetHeight > scrollTop + 10) {
          visibleIdx = i;
          break;
        }
      }
      // 해당 항목이 속한 페이지 찾기
      let currentPage = 1;
      for (let j = sortedEntries.length - 1; j >= 0; j--) {
        if (visibleIdx >= sortedEntries[j][1]) {
          currentPage = sortedEntries[j][0];
          break;
        }
      }
      setSelectedPageIndex(currentPage - 1);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [pageToDataIndex]);

  // 페이지 매핑이 없을 때 폴백: 뷰포트 높이 기반 스크롤 추적
  useEffect(() => {
    if (pageToDataIndex.size > 0) return;
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
  }, [totalPages, pageToDataIndex]);

  const scrollToPage = (pageIndex: number) => {
    const pageNum = pageIndex + 1; // 1-based
    const dataIdx = pageToDataIndex.get(pageNum);

    // 매핑이 있으면 해당 번역 항목으로 스크롤
    if (dataIdx !== undefined && itemRefs.current[dataIdx]) {
      itemRefs.current[dataIdx]!.scrollIntoView({ behavior: "smooth", block: "start" });
      setSelectedPageIndex(pageIndex);
      return;
    }

    // 폴백: 뷰포트 높이 기반 스크롤
    const el = contentScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: pageIndex * el.clientHeight, behavior: "smooth" });
    setSelectedPageIndex(pageIndex);
  };

  const handlePageChange = (page: number) => {
    const pageIndex = Math.max(0, Math.min(page - 1, totalPages - 1));
    scrollToPage(pageIndex);
  };

  const handleToggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleFilterChange = (mode: "all" | "korean" | "english") => {
    setFilterMode(mode);
  };

  // PDF URL 가져오기
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const documentId = sessionStorage.getItem("documentId");
        if (!documentId) return;

        const documentDetail = await getDocumentDetail(
          documentId,
          accessToken ?? undefined
        );

        if (documentDetail.storagePath) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://be-paper-dot.store";
          // storagePath가 이미 전체 URL인지 확인
          const url = documentDetail.storagePath.startsWith("http")
            ? documentDetail.storagePath
            : `${apiUrl}${documentDetail.storagePath.startsWith("/") ? "" : "/"}${documentDetail.storagePath}`;
          setPdfUrl(url);
        }
      } catch (error) {
        console.warn("PDF URL을 가져오는데 실패했습니다:", error);
      }
    };

    fetchPdfUrl();
  }, [accessToken]);

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
                    className={`${styles.pageCard} ${index === selectedPageIndex ? styles.pageCardSelected : ""
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
          {data.map((item, index) => (
            <div
              className={styles.docUnitIdItem}
              key={item.docUnitId}
              ref={(el) => { itemRefs.current[index] = el; }}>
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
          ))}
        </div>
      </div>
    </main>
  );
}
