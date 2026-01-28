"use client";

import styles from "@/app/components/mypage/ui/MyPage.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  type: "pdf";
  date: string;
  size: string;
}

export default function MyDocument() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();

  const handleStartNewDocument = () => {
    router.push("/newdocument");
  };

  return (
    <div className={styles.section}>
      {documents.length === 0 ? (
        <>
          <div className={styles.emptyStatePrompt}>
            <p className={styles.emptyStatePromptTitle}>
              읽은 문서가 생기면 이곳에 자동으로 모여요.
            </p>
            <div className={styles.emptyStatePromptBox}>
              <p className={styles.emptyStatePromptText}>
                업로드 된 파일이 없습니다.
                <br />
                파일을 번역하고 관리해보세요
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
        </>
      ) : (
        <>
          <div className={styles.recentDocumentPrompt}>
            <p className={styles.recentDocumentPromptText}>안녕하세요</p>
          </div>

          <h2 className={styles.recentDocumentsTitle}>최근 읽은 문서</h2>
          <table className={styles.documentsTable}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell} style={{ width: "40%" }}>
                  파일명
                </th>
                <th className={styles.tableHeaderCell} style={{ width: "20%" }}>
                  날짜
                </th>
                <th className={styles.tableHeaderCell} style={{ width: "20%" }}>
                  용량
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}>
                      <span
                        className={`${styles.fileBadge} ${
                          doc.type === "pdf"
                            ? styles.fileBadgePdf
                            : styles.fileBadgeTxt
                        }`}>
                        {doc.type.toUpperCase()}
                      </span>
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>{doc.date}</td>
                  <td className={styles.tableCell}>{doc.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
