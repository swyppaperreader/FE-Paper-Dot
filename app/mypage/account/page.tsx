"use client";

import React, { useState, useRef } from "react";
import styles from "@/app/components/mypage/ui/MyPage.module.css";
import Image from "next/image";
import Button from "@/app/components/button/Button";

export default function MyAccount() {
  const mockUser = {
    name: "김유저",
    email: "testid@kakao.com",
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoutClick = () => {
    console.log("로그아웃");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleChangeProfileImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      console.log("선택된 파일:", file.name);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  console.log(profileImage);

  return (
    <div className={styles.accountSection}>
      <div className={styles.accountTopBar}>
        <div className={styles.accountProfileBar}>
          <div className={styles.accountProfileImageSmallContainer}>
            {profileImage && (
              <Image
                src={profileImage}
                alt="userImage"
                width={80}
                height={80}
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className={styles.hiddenFileInput}
            />
            <Button
              className={styles.accountProfileImageSmall}
              onClick={handleChangeProfileImage}>
              <Image
                src="/cameraIcon.svg"
                alt="cameraIcon"
                width={12}
                height={12}
                className={styles.cameraIcon}
              />
            </Button>
          </div>
          <h2 className={styles.accountProfileNameSmall}>{mockUser.name}</h2>
        </div>
        <Button
          className={styles.accountLogoutBtnTop}
          onClick={handleLogoutClick}>
          로그아웃
        </Button>
      </div>

      <div className={styles.accountFormSection}>
        <div className={styles.accountFormRow}>
          <p className={styles.accountFormLabel}>소셜 로그인</p>
          <div className={styles.accountSocialLoginRight}>
            <Image
              src="/kakaoIcon.svg"
              alt="카카오"
              width={32}
              height={32}
              style={{ borderRadius: "8px" }}
              priority
            />
            <p className={styles.accountSocialLoginText}>
              카카오톡 연동 로그인
            </p>
          </div>
        </div>

        <div className={styles.accountFormRow}>
          <p className={styles.accountFormLabel}>이름</p>
          <div className={styles.accountInputContainer}>
            <p className={styles.accountInputText}>{mockUser.name}</p>
          </div>
        </div>
      </div>

      <div className={styles.accountManagementSection}>
        <Button
          onClick={() => setShowDeleteModal(true)}
          className={styles.deleteAccountLink}>
          <p className={styles.deleteAccountLinkText}>탈퇴하기</p>
        </Button>

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
                  onClick={() => {
                    handleDeleteAccount();
                    setShowDeleteModal(false);
                  }}
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
