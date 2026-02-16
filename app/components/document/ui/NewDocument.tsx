"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./NewDocument.module.css";
import { formatFileSize } from "@/app/utils/useFormatFileSize";
import {
  getTranslation,
  postDocuments,
  postTranslation,
} from "@/app/services/document";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";
import { useRouter } from "next/navigation";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface Document {
  documentId: string;
  fileId: string | null;
  fileSizeBytes: number;
  fileType: string;
  mimeType: string;
  originalFilename: string;
  status: string;
  storagePath: string;
}

interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

export default function NewDocumentPage() {
  const [, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [document, setDocument] = useState<Document | null>(null);
  const [translatedText, setTranslatedText] = useState<TranslationPair[]>([]);

  const userInfo = useLoginStore((state) => state.userInfo);
  const accessToken = useAccessTokenStore((state) => state.accessToken);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setUploadingFiles((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}`,
            file,
            progress: 0,
            status: "uploading",
          },
        ]);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setUploadingFiles((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}`,
            file,
            progress: 0,
            status: "uploading",
          },
        ]);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
      }
    }
    // 같은 파일을 다시 선택할 수 있도록 input 값 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadingFiles([]);
    console.log("uploadingFiles", uploadingFiles);
  };

  // 파일이 추가되면 자동으로 업로드 시작
  useEffect(() => {
    const currentFile = uploadingFiles.find(
      (file) => file.status === "uploading" && file.progress === 0
    );
    if (!currentFile) {
      return;
    }

    const uploadFile = async () => {
      try {
        const formData = new FormData();
        formData.append("ownerId", userInfo?.userId as string);
        formData.append("title", currentFile?.file?.name ?? "");
        formData.append("languageSrc", "ko");
        formData.append("languageTgt", "en");
        formData.append("file", currentFile?.file);

        const response = await postDocuments(formData);
        // API 응답 형태: { data: { ... } } | { document: { ... } } | { documentId, ... }
        const doc = response?.data ?? response?.document ?? response;
        if (doc?.documentId != null) {
          const documentIdStr = String(doc.documentId);
          setDocument({ ...doc, documentId: documentIdStr });
          sessionStorage.setItem("documentId", documentIdStr);
        }

        // PDF 파일 데이터를 sessionStorage에 저장 (읽기 페이지에서 사용)
        const reader = new FileReader();
        reader.onload = () => {
          try {
            sessionStorage.setItem("pdfFileData", reader.result as string);
          } catch (e) {
            console.warn("PDF 데이터 저장 실패 (파일이 너무 큼):", e);
          }
        };
        reader.readAsDataURL(currentFile.file);

        setUploadingFiles((prev) =>
          prev.map((file) =>
            file.id === currentFile?.id
              ? { ...file, status: "completed", progress: 80 }
              : file
          )
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "파일 업로드에 실패했습니다.";
        alert(message);
        setUploadingFiles((prev) =>
          prev.map((file) =>
            file.id === currentFile.id
              ? { ...file, progress: 0, status: "error" }
              : file
          )
        );
      }
    };

    uploadFile();
  }, [uploadingFiles, accessToken, userInfo?.userId]);

  // 업로드가 성공해 document가 생긴 뒤: 1) postTranslation → 2) getTranslation (폴링)
  useEffect(() => {
    if (!document || !uploadingFiles[0]?.file || !accessToken) {
      return;
    }

    const requestTranslation = async () => {
      try {
        setIsTranslating(true);
        // 1) 문서 처리 파이프라인 (서버가 비동기로 처리함)
        await postTranslation(document.documentId);
        // 2) 처리 완료될 때까지 주기적으로 조회 (폴링)
        const maxAttempts = 20;
        const intervalMs = 3000;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            await new Promise((r) => setTimeout(r, intervalMs));
            const raw = await getTranslation(document.documentId);
            const list = Array.isArray(raw) ? raw : [];
            if (list.length > 0) {
              const pairs: TranslationPair[] = list.map(
                (pair: TranslationPair) => ({
                  docUnitId: pair.docUnitId,
                  sourceText: pair.sourceText ?? "",
                  translatedText: pair.translatedText ?? "",
                })
              );
              setTranslatedText(pairs);
              sessionStorage.setItem("translationPairs", JSON.stringify(list));
              sessionStorage.setItem("fileName", uploadingFiles[0].file.name);
              setUploadingFiles((prev) =>
                prev.map((f) =>
                  f.status === "completed" ? { ...f, progress: 100 } : f
                )
              );
              return; // 성공 시 종료
            }
            // 빈 배열이면 계속 시도 (404는 정상적인 상태)
          } catch (e) {
            const error = e as Error;
            // 404는 아직 처리 중이므로 무시하고 계속 시도
            if (error.message.includes("404") || error.message.includes("번역된 문서를 가져오는데 실패")) {
              lastError = null; // 404는 에러로 간주하지 않음
              continue;
            }
            // 다른 에러는 저장하고 계속 시도
            lastError = error;
            console.warn(`번역 조회 시도 ${attempt + 1}/${maxAttempts} 실패:`, error.message);
          }
        }

        // 최종 실패 시 사용자에게 알림
        if (lastError) {
          alert(
            `번역 처리 중 오류가 발생했습니다: ${lastError.message}\n\n잠시 후 새로고침하여 다시 시도해주세요.`
          );
        } else {
          alert(
            "번역 처리가 완료되지 않았습니다. 잠시 후 새로고침하여 다시 시도해주세요."
          );
        }
        console.warn(
          "번역 결과를 가져오지 못했습니다. 잠시 후 새로고침 후 다시 시도해보세요."
        );
      } catch (e) {
        const error = e as Error;
        console.error("번역 요청/조회 실패", error);
        alert(
          `번역 요청에 실패했습니다: ${error.message}\n\n다시 시도해주세요.`
        );
      } finally {
        setIsTranslating(false);
      }
    };

    requestTranslation();
  }, [document, accessToken, uploadingFiles]);

  console.log(document);
  console.log("translatedText", translatedText);

  return (
    <main className={styles.container}>
      <section className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>번역할 파일을 업로드 해주세요.</h1>
            <p className={styles.pageSubtitle}>
              페이퍼닷이 번역하고, 한 줄 한 줄 읽기 쉽게 정리해드릴게요.
            </p>
          </div>

          {document && translatedText.length === 0 && isTranslating && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner} aria-hidden />
              <p className={styles.loadingText}>문서를 불러오는 중입니다...</p>
            </div>
          )}

          {uploadingFiles.length > 0 && (
            <div className={styles.uploadingFilesWrapper}>
              <Image src="/pdf.svg" alt="pdf" width={40} height={40} />
              <div className={styles.uploadingItem}>
                <p className={styles.fileName}>{uploadingFiles[0].file.name}</p>
                <div className={styles.fileInfo}>
                  <p className={styles.fileSize}>
                    {formatFileSize(uploadingFiles[0].file.size)}
                  </p>
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${uploadingFiles[0].progress}%`,
                      }}
                    />
                  </div>
                  <p className={styles.progressPercent}>
                    {Math.round(uploadingFiles[0].progress)}%
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.closeIcon}
                onClick={handleRemoveFile}
                disabled={uploadingFiles[0]?.progress !== 100}
                style={
                  uploadingFiles[0]?.status === "completed"
                    ? { cursor: "pointer" }
                    : { cursor: "not-allowed" }
                }>
                <Image src="/close.svg" alt="close" width={12} height={12} />
              </button>
            </div>
          )}

          {translatedText.length > 0 && document && (
            <button
              type="button"
              className={styles.viewResultButton}
              onClick={() => router.push(`/read`)}>
              번역 결과 보기
            </button>
          )}

          {uploadingFiles.length === 0 && (
            <div
              className={styles.uploadArea}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}>
              <div className={styles.uploadIconWrapper}>
                <Image
                  src="/uploadIcon.svg"
                  alt="upload"
                  width={32}
                  height={32}
                  className={styles.uploadIconImage}
                />
                <div className={styles.uploadText}>
                  <p className={styles.uploadMainText}>
                    클릭해서 PDF 파일을 선택
                  </p>
                  <p className={styles.uploadSubText}>
                    또는 파일을 드래그해서 업로드하세요
                  </p>
                </div>
              </div>
              <p className={styles.uploadLimit}></p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className={styles.hiddenFileInput}
          />
        </div>
      </section>
    </main>
  );
}
