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

  // 업로드 성공 후: postTranslation → 응답 온 뒤 getTranslation 폴링 (404 = 아직 처리 중)
  useEffect(() => {
    if (!document || !uploadingFiles[0]?.file || !accessToken) return;

    const applyResult = (list: TranslationPair[]) => {
      if (list.length === 0) return false;
      setTranslatedText(list);
      if (uploadingFiles[0]) {
        sessionStorage.setItem("translationPairs", JSON.stringify(list));
        sessionStorage.setItem("fileName", uploadingFiles[0].file.name);
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.status === "completed" ? { ...f, progress: 100 } : f
          )
        );
      }
      return true;
    };

    const run = async () => {
      try {
        setIsTranslating(true);
        await postTranslation(document.documentId);
        // 번역이 준비될 때까지 폴링 (404면 서버가 아직 처리 중)
        const maxAttempts = 25;
        const intervalMs = 3000;
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((r) => setTimeout(r, intervalMs));
          const data = await getTranslation(document.documentId, accessToken);
          const list = Array.isArray(data) ? data : [];
          if (applyResult(list)) {
            setIsTranslating(false);
            return;
          }
        }
        console.warn(
          "번역 결과를 가져오지 못했습니다. 잠시 후 새로고침 후 다시 시도해보세요."
        );
      } catch (e) {
        console.error("번역 요청/조회 실패:", e);
      } finally {
        setIsTranslating(false);
      }
    };

    run();
  }, [document?.documentId]);

  console.log("translatedText", translatedText);

  const isUploading =
    uploadingFiles.length > 0 && uploadingFiles[0]?.status === "uploading";
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

          {isUploading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner} aria-hidden />
              <p className={styles.loadingText}>
                파일을 업로드하는 중입니다...
              </p>
            </div>
          )}

          {isTranslationLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner} aria-hidden />
              <p className={styles.loadingText}>
                번역 중입니다. 잠시만 기다려주세요...
              </p>
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
