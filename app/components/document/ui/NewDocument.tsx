"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./NewDocument.module.css";
import { formatFileSize } from "@/app/utils/useFormatFileSize";
import {
  getTranslation,
  getTranslationStatus,
  postDocuments,
  postTranslation,
} from "@/app/services/document";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";
import { useRouter } from "next/navigation";
import { MessageEvent } from "event-source-polyfill";

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
  const [document, setDocument] = useState<Document | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState<{
    translated: number;
    total: number;
  } | null>(null);
  const [translationStatus, setTranslationStatus] = useState<string | null>(
    null
  );
  const [translatedText, setTranslatedText] = useState<TranslationPair[]>([]);
  const [batchFailures, setBatchFailures] = useState<
    { start: number; end: number; reason: string }[]
  >([]);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const cancelledRef = useRef(false);

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
    setTranslationError(null);
    setBatchFailures([]);
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

  const eventSourceRef = useRef<EventSource | null>(null);

  // document 올라오면 번역 시작 → SSE(getTranslationStatus) → 서버가 스트림 닫으면 getTranslation 호출 → allTranslated면 끝, 아니면 SSE 다시 열고 반복
  useEffect(() => {
    if (!document?.documentId || !uploadingFiles[0]?.file || !accessToken)
      return;

    cancelledRef.current = false;

    const applyResult = (list: TranslationPair[]) => {
      if (list.length === 0) return;
      setTranslatedText(list);
      sessionStorage.setItem("translationPairs", JSON.stringify(list));
      sessionStorage.setItem("fileName", uploadingFiles[0].file.name);
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.status === "completed" ? { ...f, progress: 100 } : f
        )
      );
    };

    const waitForStreamClose = (eventSource: EventSource): Promise<void> =>
      new Promise((resolve) => {
        eventSource.onerror = () => {
          eventSource.close();
          resolve();
        };
      });

    const run = async () => {
      try {
        setIsTranslating(true);
        setTranslationError(null);
        await postTranslation(document.documentId, accessToken);
        if (cancelledRef.current) return;

        const MAX_RECONNECT = 60;
        let reconnectCount = 0;

        while (!cancelledRef.current && reconnectCount < MAX_RECONNECT) {
          reconnectCount += 1;
          const eventSource = getTranslationStatus(
            document.documentId,
            accessToken
          );
          eventSourceRef.current = eventSource;

          eventSource.addEventListener("message", (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              console.log("data", data);
              if (data?.translated != null && data?.total != null) {
                setTranslationProgress({
                  translated: data.translated,
                  total: data.total,
                });
              }
            } catch {
              /* ignore */
            }
          });

          await waitForStreamClose(eventSource);
          eventSourceRef.current = null;
          if (cancelledRef.current) return;

          const data = await getTranslation(document.documentId, accessToken);
          if (!Array.isArray(data) || data.length === 0) continue;

          const translatedCount = data.filter(
            (item) =>
              item.translatedText != null &&
              String(item.translatedText).trim() !== ""
          ).length;
          const total = data.length;
          setTranslationProgress({ translated: translatedCount, total });

          if (translatedCount === total) {
            setTranslationProgress(null);
            applyResult(data);
            setIsTranslating(false);
            return;
          }

          if (reconnectCount >= MAX_RECONNECT && !cancelledRef.current) {
            setTranslationError(
              "번역 대기 시간이 초과되었어요. 잠시 후 다시 시도해주세요."
            );
            setIsTranslating(false);
          }
          await new Promise((r) => setTimeout(r, 3000));
        }
      } catch (e) {
        if (!cancelledRef.current) {
          console.error("[번역 시작/진행 실패]", e);
          setTranslationError("번역을 진행하지 못했어요.");
          setIsTranslating(false);
        }
      }
    };

    run();

    return () => {
      cancelledRef.current = true;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?.documentId]);

  console.log("translatedText", translatedText);

  const isTranslationLoading =
    document != null && translatedText.length === 0 && isTranslating;

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

          {uploadingFiles.length > 0 && (
            <div className={styles.uploadSection}>
              {isTranslationLoading && (
                <div className={styles.loadingOverlayOnTop}>
                  <div className={styles.loadingSpinner} aria-hidden />
                  <p className={styles.loadingText}>
                    {translationProgress != null
                      ? `${translationProgress.translated}/${
                          translationProgress.total
                        } (${Math.round(
                          (100 * translationProgress.translated) /
                            translationProgress.total
                        )}%) 번역 중...`
                      : "번역 중입니다. 잠시만 기다려주세요..."}
                  </p>
                </div>
              )}
              <div className={styles.uploadingFilesWrapper}>
                <Image src="/pdf.svg" alt="pdf" width={40} height={40} />
                <div className={styles.uploadingItem}>
                  <p className={styles.fileName}>
                    {uploadingFiles[0].file.name}
                  </p>
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
              {translationError && !isTranslating && (
                <p className={styles.translationError} role="alert">
                  {translationError}
                </p>
              )}
            </div>
          )}

          {translatedText.length > 0 && document && (
            <>
              {batchFailures.length > 0 && (
                <p className={styles.batchFailureNotice} role="status">
                  일부 구간 번역에 실패했어요. 나머지 결과는 확인할 수 있습니다.
                </p>
              )}
              <button
                type="button"
                className={styles.viewResultButton}
                onClick={() => router.push(`/read`)}>
                번역 결과 보기
              </button>
            </>
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
