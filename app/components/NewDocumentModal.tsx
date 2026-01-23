"use client";

import { useState, useRef } from "react";
import styles from "./NewDocumentModal.module.css";

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export default function NewDocumentModal({
  isOpen,
  onClose,
  onFileSelect,
}: NewDocumentModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
        onFileSelect(file);
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
        onFileSelect(file);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* 백드롭 */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* 모달 */}
      <div className={styles.modalContainer}>
        <div className={styles.modal}>
          {/* 헤더 */}
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>대충 뭔진 멘트로 서비스 설명</h2>
            <p className={styles.modalSubtitle}>
              디테일한 설명을 나열해서 뭘 표현 디테일한 설명을 나열해서 뭘 표현
            </p>
          </div>

          {/* 드래그 앤 드롭 영역 */}
          <div
            className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaDragging : ""
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            {/* 아이콘 */}
            <div className={styles.uploadIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            {/* 텍스트 */}
            <div className={styles.uploadText}>
              <p className={styles.uploadMainText}>클릭해서 PDF 파일을 선택</p>
              <p className={styles.uploadSubText}>
                또는 파일을 드래그해서 업로드하세요
              </p>
            </div>

            {/* 제한사항 */}
            <p className={styles.uploadLimit}>최대 N용량까지 가능합니다.</p>
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className={styles.hiddenFileInput}
          />

          {/* 버튼 */}
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
