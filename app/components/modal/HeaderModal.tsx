"use client";

import React, { useState, useRef } from "react";
import styles from "@/app/components/modal/headerModal.module.css";
import Button from "@/app/components/common/button/Button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useLoginStore } from "@/app/store/useLogin";
import { useClickOutSide } from "@/app/hooks/useClickOutSide";
import { createClient } from "@/app/lib/client";

export default function HeaderModal({
  isReadHeader,
  className,
}: {
  isReadHeader?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);
  const userInfo = useLoginStore((state) => state.userInfo);
  const clearUserInfo = useLoginStore((state) => state.clearUserInfo);
  const isLogin = useLoginStore((state) => state.login);
  const router = useRouter();

  const supabase = createClient();

  const closeModal = () => {
    setIsOpen(false);
    setOpenPath(null);
  };

  const toggleModal = () => {
    if (isOpen) {
      closeModal();
      return;
    }
    setOpenPath(pathname);
    setIsOpen(true);
  };

  const isModalVisible = isOpen && openPath === pathname && isLogin;

  // 바깥 클릭 감지
  useClickOutSide(modalRef as React.RefObject<HTMLElement>, closeModal);

  const handleLogoutClick = async () => {
    try {
      await supabase.auth.signOut();

      clearUserInfo();
      closeModal();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className={className ? className : styles.headerModalContainer}
      ref={modalRef}>
      <div className={styles.myPageButtonContainer}>
        <>
          {!isLogin && (
            <Button
              className={styles.loginButton}
              onClick={() => router.push("/login")}>
              <p className={styles.loginButtonText}>로그인/회원가입</p>
            </Button>
          )}
        </>
        {!isReadHeader && isLogin && (
          <Button
            className={styles.newDocumentButton}
            onClick={() => router.push("/newdocument")}>
            새 문서 만들기
          </Button>
        )}
        <Button
          className={styles.userImageButton}
          onClick={toggleModal}>
          {userInfo?.profileImageUrl && (
            <Image
              src={userInfo.profileImageUrl}
              alt="user image"
              width={40}
              height={40}
              className={styles.userImage}
              unoptimized
            />
          )}
        </Button>
      </div>
      {isModalVisible && (
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
              onClick={closeModal}>
              내 문서함
            </Link>
            <Link
              href="/mypage/account"
              className={styles.headerMiddleTitle}
              onClick={closeModal}>
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
