"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Header from "../components/header/Header";

import styles from "./newdocument.module.css";
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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
            <div className={styles.uploadingContainer}>
              {uploadingFiles.map((uploadFile) => (
                <div key={uploadFile.id} className={styles.uploadingItem}>
                  <div className={styles.uploadingItemHeader}>
                    <div className={styles.uploadingItemInfo}>
                      <div className={styles.fileIcon}>
                        <Image
                          src="/PDF.png"
                          alt="PDF 파일"
                          width={24}
                          height={24}
                          priority
                        />
                      </div>
                      <div className={styles.fileDetails}>
                        <p className={styles.fileName}>
                          {uploadFile.file.name}
                        </p>
                        <p className={styles.fileSize}>
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                      </div>
                    </div>

                    <div className={styles.uploadingItemStatus}>
                      {uploadFile.status === "uploading" && (
                        <span className={styles.progressPercent}>
                          {Math.round(uploadFile.progress)}%
                        </span>
                      )}
                      {uploadFile.status === "completed" && (
                        <div className={styles.checkmark}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                      {uploadFile.status === "error" && (
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveFile(uploadFile.id)}>
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.progressBarContainer}>
                    <div
                      className={`${styles.progressBar} ${
                        uploadFile.status === "completed"
                          ? styles.progressBarCompleted
                          : ""
                      }`}
                      style={{
                        width: `${uploadFile.progress}%`,
                      }}
                    />
                  </div>

                  <p
                    className={`${styles.statusMessage} ${
                      uploadFile.status === "completed"
                        ? styles.statusCompleted
                        : ""
                    }`}>
                    {uploadFile.status === "uploading" && "업로드 중..."}
                    {uploadFile.status === "completed" && "업로드 완료! ✓"}
                    {uploadFile.status === "error" && "업로드 실패"}
                  </p>
                </div>
              ))}
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
                <div className={styles.uploadIcon}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>
              <div className={styles.uploadText}>
                <p className={styles.uploadMainText}>
                  클릭해서 PDF 파일을 선택
                </p>
                <p className={styles.uploadSubText}>
                  또는 파일을 드래그해서 업로드하세요
                </p>
              </div>

              <p className={styles.uploadLimit}>최대 50MB까지 가능합니다.</p>
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
