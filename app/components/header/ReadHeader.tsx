"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./readHeader.module.css";
import HeaderModal from "../modal/HeaderModal";
import HeaderToggle from "./toggle/headerToggle";
import Button from "../button/Button";

interface ReadHeaderProps {
  fileName: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleSidebar: () => void;
}

export default function ReadHeader({
  fileName,
  currentPage,
  totalPages,
  onPageChange,
  onToggleSidebar,
}: ReadHeaderProps) {
  const [inputValue, setInputValue] = useState<string>(String(currentPage));
  const inputRef = useRef<HTMLInputElement>(null);

  // currentPage가 변경될 때 inputValue 업데이트
  useEffect(() => {
    setInputValue(String(currentPage));
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 허용
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const pageNum = parseInt(inputValue, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      // 유효하지 않은 값이면 현재 페이지로 복원
      setInputValue(String(currentPage));
    } else if (pageNum > totalPages) {
      // 전체 페이지 수를 초과하면 마지막 페이지로
      onPageChange(totalPages);
      setInputValue(String(totalPages));
    } else {
      // 유효한 페이지 번호면 해당 페이지로 이동
      onPageChange(pageNum);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={"/"} className={styles.link}>
          <Image src="/Logo.svg" alt="Paperdot" width={106} height={40} />
        </Link>
        <div className={styles.readHeaderLeftControls}>
          <Button
            className={styles.readHeaderUserImageButton}
            onClick={onToggleSidebar}>
            <Image src="/slide.svg" alt="slide" width={24} height={24} />
          </Button>
          <div className={styles.readHeaderPageNumber}>
            <div className={styles.readHeaderPageNumberPageContainer}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className={styles.readHeaderPageNumberPage}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  textAlign: "center",
                  padding: 0,
                }}
              />
            </div>
            <p className={styles.readHeaderPageNumberTotal}>/ {totalPages}</p>
          </div>
        </div>
        {fileName && (
          <p className={styles.readHeaderFileName}>{fileName}</p>
        )}
        <div className={styles.readHeaderRightSection}>
          <HeaderToggle />
          <HeaderModal isReadHeader={true} className={styles.readHeaderModal} />
        </div>
      </div>
    </header>
  );
}
