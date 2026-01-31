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
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [customReason, setCustomReason] = useState("");

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

  return (
    <main className={styles.accountSection}>
      <section className={styles.accountTopBar}>
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
      </section>

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

      <section className={styles.accountManagementSection}>
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
                탈퇴 시 번역 기록, 내정보를 포함한 모든 데이터가 삭제되며 <br />
                복구할 수 없습니다.
              </p>

              <label className={styles.agreeCheckbox}>
                <input
                  type="checkbox"
                  checked={agreeChecked}
                  onChange={(e) => setAgreeChecked(e.target.checked)}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxLabel}>동의합니다.</span>
              </label>

              <div className={styles.deleteReasonSection}>
                <label className={styles.deleteReasonLabel}>
                  계정 삭제 이유를 알려주세요
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className={styles.deleteReasonSelect}
                    disabled={!agreeChecked}>
                    <option value="">선택해주세요</option>
                    <option value="service_not_needed">
                      더 이상 사용할 일이 없어서
                    </option>
                    <option value="privacy_concern">
                      필요한 기능이 없어서(하이라이트, 단어장 등)
                    </option>
                    <option value="too_many_ads">
                      다른 서비스(번역기, ai)를 사용해서
                    </option>
                    <option value="quality_not_good">
                      번역 품질이 기대에 미치지 못해서
                    </option>
                    <option value="etc">기타(직접입력)</option>
                  </select>
                </div>

                {/* 기타 선택 시 textarea 나타나게 하려면 아래처럼 조건부 렌더링 */}
                {deleteReason === "etc" && (
                  <div className={styles.customReasonWrapper}>
                    <textarea
                      placeholder="직접 입력해주세요"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className={styles.customReasonTextarea}
                      disabled={!agreeChecked}
                      maxLength={80}
                    />
                    <div className={styles.charCountWrapper}>
                      <span className={styles.charCountCurrent}>
                        {customReason.length}
                      </span>{" "}
                      / 80
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.deleteModalButtons}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.deleteModalCancelBtn}>
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className={styles.deleteModalConfirmBtn}
                  disabled={!agreeChecked || deleteReason === ""}>
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
