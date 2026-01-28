"use client";

import React, { useState } from "react";
import styles from "./headerModal.module.css";
import Button from "../button/Button";
import Image from "next/image";

export default function HeaderModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.headerModalContainer}>
      <div className={styles.myPageButtonContainer}>
        <Button className={styles.newDocumentButton}>새 문서 만들기</Button>
        <Button
          className={styles.userImageButton}
          onClick={() => setIsOpen(!isOpen)}>
          <Image src="/userImage.svg" alt="userImage" width={24} height={24} />
        </Button>
      </div>
      {isOpen && (
        <div className={styles.headerModalWrapper}>
          <div className={styles.headerModal}>
            <p className={styles.headerModalName}>김유저</p>
            <p className={styles.headerModalEmail}>testid@naver.com</p>
          </div>
          <div className={styles.headerMiddleTitleContainer}>
            <p className={styles.headerMiddleTitle}>내 문서함</p>
            <p className={styles.headerMiddleTitle}>내 계정</p>
          </div>
          <div className={styles.headerModalLogoutButton}>
            <p className={styles.headerModalEmail}>로그아웃</p>
          </div>
        </div>
      )}
    </div>
  );
}
