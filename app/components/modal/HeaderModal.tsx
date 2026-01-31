"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./headerModal.module.css";
import Button from "../button/Button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderModal({
  isReadHeader,
  className,
}: {
  isReadHeader?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef<string>(pathname);

  const router = useRouter();

  // 경로 변경 시 모달 닫기
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [pathname]);

  // 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={className ? className : styles.headerModalContainer}
      ref={modalRef}>
      <div className={styles.myPageButtonContainer}>
        {!isReadHeader && (
          <Button
            className={styles.newDocumentButton}
            onClick={() => router.push("/newdocument")}>
            새 문서 만들기
          </Button>
        )}
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
            <Link
              href="/mypage/mydocument"
              className={styles.headerMiddleTitle}
              onClick={() => setIsOpen(false)}>
              내 문서함
            </Link>
            <Link
              href="/mypage/account"
              className={styles.headerMiddleTitle}
              onClick={() => setIsOpen(false)}>
              내 계정
            </Link>
          </div>
          <div className={styles.headerModalLogoutButton}>
            <p className={styles.headerModalEmail}>로그아웃</p>
          </div>
        </div>
      )}
    </div>
  );
}
