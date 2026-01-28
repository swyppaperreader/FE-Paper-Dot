"use client";

import React, { useState } from "react";
import styles from "@/app/components/mypage/ui/MyPage.module.css";
import Image from "next/image";

export default function MyAccount() {
  const mockUser = {
    name: "김유저",
    email: "testid@kakao.com",
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogoutClick = () => {
    console.log("로그아웃");
  };

  const handleDeleteAccount = () => {
    console.log("회원탈퇴");
  };

  const handleShowDeleteModal = () => {
    console.log("회원탈퇴 모달 표시");
  };

  return (
    <div className={styles.section}>
      <div className={styles.accountHeader}>
        <h1 className={styles.accountTitle}>계정 정보 확인</h1>
      </div>

      <div className={styles.accountTopBar}>
        <div className={styles.accountProfileBar}>
          <div className={styles.accountProfileImageSmall}></div>
          <h2 className={styles.accountProfileNameSmall}>{mockUser.name}</h2>
        </div>
        <button
          className={styles.accountLogoutBtnTop}
          onClick={handleLogoutClick}>
          로그아웃
        </button>
      </div>

      <div className={styles.accountFormSection}>
        <div className={styles.accountFormRow}>
          <label className={styles.accountFormLabel}>소셜 로그인</label>
          <div className={styles.accountSocialLoginRight}>
            <Image
              src="/kakaoLogo.svg"
              alt="카카오"
              width={45}
              height={45}
              style={{ borderRadius: "8px" }}
              priority
            />
            <p className={styles.accountSocialLoginText}>
              카카오톡 연동 로그인
            </p>
          </div>
        </div>

        <div className={styles.accountFormRow}>
          <label className={styles.accountFormLabel}>이름</label>
          <input
            type="text"
            defaultValue={mockUser.name}
            className={styles.accountInput}
            placeholder="이름 입력"
          />
        </div>

        <div className={styles.accountFormRow}>
          <label className={styles.accountFormLabel}>이메일</label>
          <input
            type="email"
            defaultValue={mockUser.email}
            className={`${styles.accountInput} ${styles.accountInputDisabled}`}
            disabled
          />
        </div>
      </div>

      <div className={styles.accountDivider} />

      <div className={styles.accountManagementSection}>
        <h3 className={styles.accountManagementTitle}>계정관리</h3>

        <button
          onClick={handleDeleteAccount}
          className={styles.deleteAccountLink}>
          회원탈퇴
        </button>

        {showDeleteModal && (
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalContent}>
              <h2 className={styles.deleteModalTitle}>회원탈퇴</h2>
              <p className={styles.deleteModalMessage}>
                정말로 회원탈퇴 하시겠습니까?
                <br />
                탈퇴 후 계정은 복구할 수 없습니다.
              </p>
              <div className={styles.deleteModalButtons}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.deleteModalCancelBtn}>
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className={styles.deleteModalConfirmBtn}>
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
