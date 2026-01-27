"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Header from "@/app/components/header/Header";

import styles from "./NewDocument.module.css";
import { formatFileSize } from "@/app/utils/useFormatFileSize";
interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export default function NewDocumentPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        handleFileUpload(file);
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
        handleFileUpload(file);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleFileUpload = (file: File) => {
    const fileId = window.crypto.randomUUID();

    setUploadingFiles((prev) => [
      ...prev,
      {
        id: fileId,
        file,
        progress: 0,
        status: "uploading",
      },
    ]);

    simulateUpload(fileId, file);
  };

  const simulateUpload = (fileId: string, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 100) progress = 100;

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress,
                status: progress === 100 ? "completed" : "uploading",
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          console.log("✅ 업로드 완료:", file.name);
        }, 1000);
      }
    }, 300);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>새 문서 만들기</h1>
            <p className={styles.pageSubtitle}>
              PDF 파일을 업로드해서 시작하세요
            </p>
          </div>

          {uploadingFiles.length > 0 && (
            <div className={styles.uploadingFilesWrapper}>
              <Image src="/pdf.png" alt="file icon" width={27} height={32} />
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
              <Image
                src="/close.svg"
                alt="close icon"
                width={12}
                height={12}
                className={styles.closeIcon}
                style={
                  uploadingFiles[0]?.progress === 100
                    ? { cursor: "pointer" }
                    : { cursor: "not-allowed" }
                }
                onClick={() =>
                  uploadingFiles[0]?.progress === 100
                    ? handleRemoveFile(uploadingFiles[0].id)
                    : null
                }
              />
            </div>
          )}

          {uploadingFiles.length === 0 && (
            <div
              className={`${styles.uploadArea} ${
                isDragging ? styles.uploadAreaDragging : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}>
              <div className={styles.uploadIconWrapper}>
                <Image
                  src="/uploadIcon.svg"
                  alt="업로드 아이콘"
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

              <p className={styles.uploadLimit}>최대 n용량까지 가능합니다.</p>
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
      </main>
    </div>
  );
}
