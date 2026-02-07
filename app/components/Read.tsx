"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./read.module.css";
import ReadHeader from "./header/ReadHeader";
import {
  getTranslatedDocument,
  TranslatedDocumentUnit,
} from "@/app/services/document";

interface PageContent {
  pageNumber: number;
  fullText: string;
  koreanText: string;
  englishText: string;
}

interface ReadProps {
  // props로 직접 번역된 데이터를 전달할 수 있음
  translatedUnits?: TranslatedDocumentUnit[];
  // 또는 문서 ID를 전달하여 API 호출
  documentId?: string | number;
}

export default function Read({ translatedUnits, documentId }: ReadProps = {}) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMode] = useState<"all" | "korean" | "english">("all");
  // const [showProfileMenu, setShowProfileMenu] = useState(false); // 향후 사용 예정
  const [showSidebar] = useState(true);
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const pageStartRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // API에서 가져온 번역된 데이터를 저장하는 state
  const [apiTranslatedUnits, setApiTranslatedUnits] = useState<
    TranslatedDocumentUnit[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터에서 문서 ID 가져오기
  const docIdFromUrl = searchParams?.get("docId") || documentId;

  // API에서 번역된 데이터 가져오기
  useEffect(() => {
    // props로 직접 데이터가 전달된 경우 또는 이미 로드된 경우
    if (translatedUnits || apiTranslatedUnits) {
      return;
    }

    // URL 파라미터나 props로 문서 ID가 있는 경우 API 호출
    if (docIdFromUrl) {
      // 비동기 함수로 분리하여 setState를 비동기적으로 호출
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getTranslatedDocument(docIdFromUrl);
          setApiTranslatedUnits(data);
          setIsLoading(false);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
          setError(errorMessage);
          setIsLoading(false);
          console.error("번역된 문서를 가져오는데 실패했습니다:", err);
        }
      };

      fetchData();
    }
  }, [docIdFromUrl, translatedUnits, apiTranslatedUnits]);

  // 사용할 번역 데이터 결정: props > API > 더미 데이터
  const activeTranslatedUnits = translatedUnits || apiTranslatedUnits;

  // API 데이터를 PageContent 형식으로 변환하는 함수
  const convertToPageContent = (
    units: TranslatedDocumentUnit[]
  ): PageContent[] => {
    // 간단하게 모든 단위를 하나의 페이지로 묶거나,
    // 필요에 따라 여러 페이지로 나눌 수 있습니다
    // 여기서는 모든 단위를 하나의 페이지로 처리합니다
    const fullText = units
      .map((unit) => `${unit.sourceText}\n${unit.translatedText}`)
      .join("\n\n");
    const koreanText = units.map((unit) => unit.translatedText).join("\n\n");
    const englishText = units.map((unit) => unit.sourceText).join("\n\n");

    return [
      {
        pageNumber: 1,
        fullText,
        koreanText,
        englishText,
      },
    ];
  };

  // 더미 데이터: 모든 텍스트를 한 곳에 저장 (API 데이터가 없을 때만 사용)
  const mockPages: PageContent[] = [
    {
      pageNumber: 1,
      fullText: `Despite these advances, concerns about the negative effects of technology on education have emerged.
이러한 발전에도 불구하고, 교육에 대한 기술의 부정적인 영향에 대한 우려가 제기되었다.

Excessive screen time can lead to eye strain and fatigue, reducing the effectiveness of learning.
과도한 화면 노출은 눈의 피로와 피곤함을 초래할 수 있으며, 학습의 효과를 감소시킨다.

Furthermore, the constant connectivity brought about by digital devices may encourage procrastination and reduce concentration.
더욱이, 디지털 기기가 가져온 지속적인 연결성은 미루는 습관을 조장하고 집중력을 감소시킬 수 있다.

Students often find themselves distracted by social media and other online content, making it difficult to maintain focus on their studies.
학생들은 종종 소셜 미디어와 다른 온라인 콘텐츠로 인해 산만해지며, 자신의 학습에 집중을 유지하기 어렵다.

Additionally, the digital divide—the gap between those with access to technology and those without—continues to create inequalities in educational opportunities.
또한, 기술에 접근할 수 있는 사람들과 그렇지 못한 사람들 사이의 격차인 디지털 격차는 계속해서 교육 기회의 불평등을 만든다.`,
      koreanText: `이러한 발전에도 불구하고, 교육에 대한 기술의 부정적인 영향에 대한 우려가 제기되었다.
과도한 화면 노출은 눈의 피로와 피곤함을 초래할 수 있으며, 학습의 효과를 감소시킨다.
더욱이, 디지털 기기가 가져온 지속적인 연결성은 미루는 습관을 조장하고 집중력을 감소시킬 수 있다.
학생들은 종종 소셜 미디어와 다른 온라인 콘텐츠로 인해 산만해지며, 자신의 학습에 집중을 유지하기 어렵다.
또한, 기술에 접근할 수 있는 사람들과 그렇지 못한 사람들 사이의 격차인 디지털 격차는 계속해서 교육 기회의 불평등을 만든다.`,
      englishText: `Despite these advances, concerns about the negative effects of technology on education have emerged.
Excessive screen time can lead to eye strain and fatigue, reducing the effectiveness of learning.
Furthermore, the constant connectivity brought about by digital devices may encourage procrastination and reduce concentration.
Students often find themselves distracted by social media and other online content, making it difficult to maintain focus on their studies.
Additionally, the digital divide—the gap between those with access to technology and those without—continues to create inequalities in educational opportunities.`,
    },
    {
      pageNumber: 2,
      fullText: `While technology offers tremendous potential, it is crucial to find a balance between digital learning and traditional methods.
기술은 엄청난 잠재력을 제공하지만, 디지털 학습과 전통적인 방법 사이의 균형을 찾는 것이 중요하다.

Educators must develop strategies to minimize distractions and ensure that technology enhances rather than hinders the learning process.
교육자들은 산만함을 최소화하고 기술이 학습 과정을 방해하기보다 개선하도록 보장하는 전략을 개발해야 한다.

In conclusion, technology is a powerful tool that can significantly improve education when used properly.
결론적으로, 기술은 올바르게 사용될 때 교육을 크게 개선할 수 있는 강력한 도구이다.

The key is to maintain a thoughtful approach to its implementation in educational settings.
핵심은 교육 환경에서의 구현에 대해 신중한 접근 방식을 유지하는 것이다.

By combining the best of both traditional and digital methods, we can create more effective and inclusive learning environments.
전통적인 방법과 디지털 방법의 최고를 결합함으로써, 우리는 더 효과적이고 포용적인 학습 환경을 만들 수 있다.`,
      koreanText: `기술은 엄청난 잠재력을 제공하지만, 디지털 학습과 전통적인 방법 사이의 균형을 찾는 것이 중요하다.
교육자들은 산만함을 최소화하고 기술이 학습 과정을 방해하기보다 개선하도록 보장하는 전략을 개발해야 한다.
결론적으로, 기술은 올바르게 사용될 때 교육을 크게 개선할 수 있는 강력한 도구이다.
핵심은 교육 환경에서의 구현에 대해 신중한 접근 방식을 유지하는 것이다.
전통적인 방법과 디지털 방법의 최고를 결합함으로써, 우리는 더 효과적이고 포용적인 학습 환경을 만들 수 있다.`,
      englishText: `While technology offers tremendous potential, it is crucial to find a balance between digital learning and traditional methods.
Educators must develop strategies to minimize distractions and ensure that technology enhances rather than hinders the learning process.
In conclusion, technology is a powerful tool that can significantly improve education when used properly.
The key is to maintain a thoughtful approach to its implementation in educational settings.
By combining the best of both traditional and digital methods, we can create more effective and inclusive learning environments.`,
    },
  ];

  // 사용할 페이지 데이터 결정
  const pagesToUse: PageContent[] = activeTranslatedUnits
    ? convertToPageContent(activeTranslatedUnits)
    : mockPages;

  // 모든 텍스트를 한 곳에 합쳐서 표시 (페이지 구분 없음)
  const getAllText = () => {
    if (filterMode === "all") {
      const allSentences: Array<{ eng: string; kor: string; pageNum: number }> =
        [];

      // API 데이터를 직접 사용하는 경우
      if (activeTranslatedUnits) {
        activeTranslatedUnits.forEach((unit) => {
          allSentences.push({
            eng: unit.sourceText.trim(),
            kor: unit.translatedText.trim(),
            pageNum: 1, // 모든 단위를 하나의 페이지로 처리
          });
        });
        return allSentences;
      }

      // 더미 데이터 사용
      pagesToUse.forEach((page) => {
        const lines = page.fullText.split("\n").filter((line) => line.trim());
        for (let i = 0; i < lines.length; i += 2) {
          if (lines[i] && lines[i + 1]) {
            allSentences.push({
              eng: lines[i].trim(),
              kor: lines[i + 1].trim(),
              pageNum: page.pageNumber,
            });
          }
        }
      });

      return allSentences;
    } else if (filterMode === "english") {
      const allEnglish: Array<{ text: string; pageNum: number }> = [];

      // API 데이터를 직접 사용하는 경우
      if (activeTranslatedUnits) {
        activeTranslatedUnits.forEach((unit) => {
          allEnglish.push({
            text: unit.sourceText.trim(),
            pageNum: 1,
          });
        });
        return allEnglish;
      }

      // 더미 데이터 사용
      pagesToUse.forEach((page) => {
        page.englishText
          .split("\n")
          .filter((line) => line.trim())
          .forEach((sentence) => {
            allEnglish.push({
              text: sentence.trim(),
              pageNum: page.pageNumber,
            });
          });
      });

      return allEnglish;
    } else {
      const allKorean: Array<{ text: string; pageNum: number }> = [];

      // API 데이터를 직접 사용하는 경우
      if (activeTranslatedUnits) {
        activeTranslatedUnits.forEach((unit) => {
          allKorean.push({
            text: unit.translatedText.trim(),
            pageNum: 1,
          });
        });
        return allKorean;
      }

      // 더미 데이터 사용
      pagesToUse.forEach((page) => {
        page.koreanText
          .split("\n")
          .filter((line) => line.trim())
          .forEach((sentence) => {
            allKorean.push({
              text: sentence.trim(),
              pageNum: page.pageNumber,
            });
          });
      });

      return allKorean;
    }
  };

  // 문장 단위로 렌더링
  const renderAllSentences = () => {
    const allText = getAllText();
    let firstPageSentenceIndex = -1;

    if (filterMode === "all") {
      const pairs = allText as Array<{
        eng: string;
        kor: string;
        pageNum: number;
      }>;
      return (
        <div>
          {pairs.map((pair, index) => {
            if (pair.pageNum === currentPage && firstPageSentenceIndex === -1) {
              firstPageSentenceIndex = index;
            }

            return (
              <div
                key={index}
                className={styles.sentencePair}
                ref={(el) => {
                  if (
                    el &&
                    pair.pageNum === currentPage &&
                    firstPageSentenceIndex === -1
                  ) {
                    pageStartRefs.current.set(currentPage, el);
                  }
                  if (el && pair.pageNum === currentPage && index === 0) {
                    pageStartRefs.current.set(currentPage, el);
                  }
                }}>
                <div className={styles.englishSentence}>{pair.eng}</div>
                <div className={styles.koreanSentence}>{pair.kor}</div>
              </div>
            );
          })}
        </div>
      );
    } else if (filterMode === "english") {
      const sentences = allText as Array<{ text: string; pageNum: number }>;
      return (
        <div>
          {sentences.map((item, index) => {
            if (item.pageNum === currentPage && firstPageSentenceIndex === -1) {
              firstPageSentenceIndex = index;
            }

            return (
              <div
                key={index}
                className={styles.sentencePair}
                ref={(el) => {
                  if (
                    el &&
                    item.pageNum === currentPage &&
                    firstPageSentenceIndex === -1
                  ) {
                    pageStartRefs.current.set(currentPage, el);
                  }
                  if (el && item.pageNum === currentPage && index === 0) {
                    pageStartRefs.current.set(currentPage, el);
                  }
                }}>
                <div className={styles.englishSentence}>{item.text}</div>
              </div>
            );
          })}
        </div>
      );
    } else {
      const sentences = allText as Array<{ text: string; pageNum: number }>;
      return (
        <div>
          {sentences.map((item, index) => {
            if (item.pageNum === currentPage && firstPageSentenceIndex === -1) {
              firstPageSentenceIndex = index;
            }

            return (
              <div
                key={index}
                className={styles.sentencePair}
                ref={(el) => {
                  if (
                    el &&
                    item.pageNum === currentPage &&
                    firstPageSentenceIndex === -1
                  ) {
                    pageStartRefs.current.set(currentPage, el);
                  }
                  if (el && item.pageNum === currentPage && index === 0) {
                    pageStartRefs.current.set(currentPage, el);
                  }
                }}>
                <div className={styles.koreanSentence}>{item.text}</div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  // 페이지 변경 시 해당 페이지 첫 문장으로 스크롤
  useEffect(() => {
    setTimeout(() => {
      if (contentBoxRef.current) {
        const element = pageStartRefs.current.get(currentPage);
        if (element) {
          const scrollTop = element.offsetTop - 16;
          contentBoxRef.current.scrollTop = scrollTop;
        }
      }
    }, 0);
  }, [currentPage, filterMode]);

  // 프로필 메뉴 토글 (향후 사용 예정)
  // const handleProfileMenuToggle = () => {
  //   setShowProfileMenu(!showProfileMenu);
  // };

  // 프로필 메뉴 닫기 (향후 사용 예정)
  // const closeProfileMenu = () => {
  //   setShowProfileMenu(false);
  // };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <ReadHeader />
      {/* ==================== 메인 콘텐츠 ==================== */}
      <div className={styles.contentWrapper}>
        {/* 로딩 상태 */}
        {isLoading && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            번역된 문서를 불러오는 중...
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
            오류: {error}
          </div>
        )}

        {/* 왼쪽 사이드바: 페이지 썸네일 (토글 가능) */}
        {showSidebar && !isLoading && !error && (
          <aside className={styles.sidebar}>
            <div className={styles.pageThumbContainer}>
              {pagesToUse.map((page) => (
                <button
                  key={page.pageNumber}
                  className={`${styles.pageThumb} ${currentPage === page.pageNumber
                    ? styles.pageThumbActive
                    : ""
                    }`}
                  onClick={() => handlePageChange(page.pageNumber)}>
                  <div className={styles.pageThumbPreview}></div>
                  <span className={styles.pageThumbNumber}>
                    {page.pageNumber}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* 중앙: 텍스트 콘텐츠 */}
        <main className={styles.mainContent}>
          <div className={styles.contentBox} ref={contentBoxRef}>
            <div className={styles.textContent}>{renderAllSentences()}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
