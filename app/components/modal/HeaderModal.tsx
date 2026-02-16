"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./headerModal.module.css";
import Button from "../button/Button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";
import { logout } from "@/app/services/logout";

// HTTP URL을 HTTPS로 변환하는 유틸 함수
const ensureHttps = (url: string): string => {
  if (!url) return url;
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};

export default function HeaderModal({
  isReadHeader,
  className,
  onLogout,
}: {
  isReadHeader?: boolean;
  className?: string;
  accessToken?: string;
  onLogout?: () => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef<string>(pathname);
  const userInfo = useLoginStore((state) => state.userInfo);

  const accessToken = useAccessTokenStore((state) => state.accessToken);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const router = useRouter();

  // 경로 변경 시 모달 닫기
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
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

  const handleLogoutClick = async () => {
    try {
      await logout(accessToken as string);
      setAccessToken(null);
    } finally {
      onLogout?.();
    }
  };

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
          {userInfo?.profileImageUrl?.includes("http") ? (
            <Image
              src={ensureHttps(userInfo.profileImageUrl)}
              alt="user image"
              width={40}
              height={40}
              className={styles.userImage}
              unoptimized
            />
          ) : (
            <Image
              src={userInfo?.profileImageUrl || "/userImage.svg"}
              alt="user image"
              width={40}
              height={40}
              className={styles.userImage}
            />
          )}
        </Button>
      </div>
      {isOpen && (
        <div className={styles.headerModalWrapper}>
          <div className={styles.headerModal}>
            <p className={styles.headerModalName}>
              {userInfo?.nickname || "김유저"}
            </p>
            <p className={styles.headerModalEmail}>
              {userInfo?.email || "testid@naver.com"}
            </p>
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
          <Button
            className={styles.headerModalLogoutButton}
            onClick={handleLogoutClick}>
            <p className={styles.headerModalEmail}>로그아웃</p>
          </Button>
        </div>
      )}
    </div>
  );
}
