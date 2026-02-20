"use client";

import { DocumentListItem, getDocumentList } from "@/app/api/document";
import Button from "@/app/components/button/Button";
import styles from "@/app/components/mypage/ui/MyPage.module.css";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyDocument() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const userData = useLoginStore((state) => state.userInfo);
  const accessToken = useAccessTokenStore((state) => state.accessToken);
  console.log(accessToken);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await getDocumentList(
        userData?.userId as string,
        accessToken as string
      );
      console.log(response);
      setDocuments(
        response.map((doc: DocumentListItem) => ({
          documentId: doc.documentId,
          title: doc.title,
          languageSrc: doc.languageSrc,
          languageTgt: doc.languageTgt,
          totalPages: doc.totalPages,
          lastTranslatedAt: doc.lastTranslatedAt,
        }))
      );
    };
    fetchDocuments();
  }, []);

  const handleStartNewDocument = () => {
    router.push("/newdocument");
  };

  return (
    <main className={styles.section}>
      {documents.length === 0 ? (
        <section className={styles.emptyStateSection}>
          <div className={styles.emptyStatePrompt}>
            <p className={styles.emptyStatePromptTitle}>
              읽은 문서가 생기면 이곳에 자동으로 모여요.
            </p>
            <div className={styles.emptyStatePromptBox}>
              <p className={styles.emptyStatePromptText}>
                업로드 된 파일이 없습니다.
                <br />
                텍스트 또는 파일을 번역하고 관리해보세요
              </p>
              <button
                className={styles.emptyStatePromptButton}
                onClick={handleStartNewDocument}>
                지금 시작하기
              </button>
            </div>
          </div>

          <div className={styles.emptyStateSection}>
            <h2 className={styles.recentDocumentsTitle}>최근 읽은 문서</h2>
            <p className={styles.emptyStateSubMessage}>
              최근 읽은 문서가 없습니다.
            </p>
          </div>
        </section>
      ) : (
        <>
          <div className={styles.recentDocumentPrompt}>
            <p className={styles.recentDocumentPromptText}>
              김유저님, [위대한 개츠비]를 이어서 볼까요?
            </p>
          </div>

          <div className={styles.documentInfo}>
            <div className={styles.documentInfoContent}>
              <Image src="/pdfLogo.svg" alt="pdf" width={40} height={40} />
              <p className={styles.documentInfoImageText}>위대한 개츠비</p>
              <Button className={styles.documentInfoButton}>이어서 보기</Button>
            </div>
            <div className={styles.documentInfoProgressContainer}>
              <p className={styles.documentInfoProgressText}>진행율</p>
              <div className={styles.documentInfoProgressValue}></div>
              <p className={styles.progressPercent}>50%</p>
            </div>
          </div>

          <h2 className={styles.recentDocumentsTitle}>최근 읽은 문서</h2>
          <table className={styles.documentsTable}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell} style={{ width: "40%" }}>
                  파일명
                </th>
                <th
                  className={styles.tableLastHeaderCell}
                  style={{ width: "20%" }}>
                  날짜
                </th>
                <th
                  className={styles.tableLastHeaderCell}
                  style={{ width: "20%" }}>
                  용량
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBodyContainer}>
              {documents.map((doc) => (
                <tr key={doc.documentId} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                      }}>
                      <Image
                        src="/smallPdfIcon.svg"
                        alt="pdf"
                        width={20}
                        height={20}
                      />
                      <span className={styles.tableCellText}>{doc.title}</span>
                    </div>
                  </td>
                  <td className={styles.tableCellInfo}>
                    <span className={styles.tableCellInfoText}>
                      {doc.lastTranslatedAt}
                    </span>
                  </td>
                  <td className={styles.tableCellInfo}>
                    <span className={styles.tableCellInfoText}>
                      {doc.totalPages}
                    </span>
                  </td>
                  <td className={styles.tableCellIcon}>
                    <Image
                      src="/trash.svg"
                      alt="delete"
                      width={20}
                      height={20}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
