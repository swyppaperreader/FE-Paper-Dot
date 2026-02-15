"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/components/mypage/ui/MyPage.module.css";
import Button from "@/app/components/button/Button";
import Image from "next/image";
import { useAccessTokenStore, useLoginStore } from "@/app/store/useLogin";
import { logout } from "@/app/services/logout";
import { withdraw } from "@/app/services/withdraw";

// HTTP URL을 HTTPS로 변환하는 유틸 함수
const ensureHttps = (url: string): string => {
  if (!url) return url;
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};

export default function MyAccount() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userInfo = useLoginStore((state) => state.userInfo);
  const setUserInfoState = useLoginStore((state) => state.setUserInfo);
  const accessToken = useAccessTokenStore((state) => state.accessToken);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log(userInfo?.userId === userInfo?.email?.includes("gmail"));

  const deleteReasonOptions = [
    { value: "service_not_needed", label: "더 이상 사용할 일이 없어서" },
    {
      value: "privacy_concern",
      label: "필요한 기능이 없어서(하이라이트, 단어장 등)",
    },
    { value: "too_many_ads", label: "다른 서비스(번역기, ai)를 사용해서" },
    { value: "quality_not_good", label: "번역 품질이 기대에 미치지 못해서" },
    { value: "etc", label: "기타(직접입력)" },
  ];

  const handleLogoutClick = async () => {
    try {
      if (accessToken) {
        await logout(accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 상태 완전히 초기화 (에러가 발생해도 초기화)
      setAccessToken(null);
      // userInfo를 null로 설정하여 로그인 전 상태로 복귀
      setUserInfoState({
        profileImageUrl: "",
        nickname: "",
        email: "",
      });
      // 완전히 새로고침하여 로그인 전 헤더 상태로 복귀
      window.location.href = "/";
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!accessToken) {
        alert("로그인 상태가 아닙니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return;
      }

      const response = await withdraw(
        userInfo?.email?.includes("gmail.com") ? "google" : "kakao",
        accessToken
      );
      console.log("response", response);

      setAccessToken(null);
      setUserInfoState({
        profileImageUrl: "",
        nickname: "",
        email: "",
      });
      setShowDeleteModal(false);

      // 완전히 새로고침하여 로그인 전 상태로 복귀
      window.location.href = "/";
    } catch (error) {
      console.error("Delete account error:", error);
    }
  };

  // const handleChangeProfileImage = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setProfileImage(URL.createObjectURL(file));
  //   }
  // };

  const handleSelectReason = (value: string) => {
    setDeleteReason(value);
    setIsDropdownOpen(false);
  };

  return (
    <main className={styles.accountSection}>
      <section className={styles.accountTopBar}>
        <div className={styles.accountProfileBar}>
          <div className={styles.accountProfileImageSmallContainer}>
            {userInfo?.profileImageUrl?.includes("http") ? (
              <Image
                src={ensureHttps(userInfo.profileImageUrl)}
                alt="profile"
                width={80}
                height={80}
                className={styles.accountProfileImage}
                unoptimized
              />
            ) : (
              <Image
                src={userInfo?.profileImageUrl || "/userImage.svg"}
                alt="profile"
                width={80}
                height={80}
                className={styles.accountProfileImage}
              />
            )}
            {/* <input
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
                alt="camera"
                width={24}
                height={24}
                className={styles.cameraIcon}
              />
            </Button> */}
          </div>
          <h2 className={styles.accountProfileNameSmall}>
            {userInfo?.nickname || "김유저"}
          </h2>
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
              src={
                userInfo?.email?.includes("gmail")
                  ? "/googleLogo.svg"
                  : "/kakaoIcon.svg"
              }
              alt={userInfo?.email?.includes("gmail") ? "google" : "kakao"}
              width={24}
              height={24}
              className={
                userInfo?.email?.includes("gmail") ? styles.googleLogo : ""
              }
            />
            <p className={styles.accountSocialLoginText}>
              {userInfo?.email?.includes("gmail.com")
                ? "구글 연동 로그인"
                : "카카오톡 연동 로그인"}
            </p>
          </div>
        </div>

        <div className={styles.accountFormRow}>
          <p className={styles.accountFormLabel}>이름</p>
          <div className={styles.accountInputContainer}>
            <p className={styles.accountInputText}>
              {userInfo?.nickname || "김유저"}
            </p>
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
              <h2 className={styles.deleteModalTitle}>회원 탈퇴</h2>

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

                {/* 🔥 커스텀 드롭다운 */}
                <div
                  className={`${styles.selectWrapper} ${!agreeChecked ? styles.disabled : ""
                    }`}
                  ref={dropdownRef}>
                  <div
                    className={`${styles.customSelectValue} ${isDropdownOpen ? styles.open : ""
                      }`}
                    onClick={() =>
                      agreeChecked && setIsDropdownOpen(!isDropdownOpen)
                    }>
                    {deleteReason
                      ? deleteReasonOptions.find(
                        (opt) => opt.value === deleteReason
                      )?.label
                      : "선택해주세요"}{" "}
                    {/* ← 이렇게 변경 */}
                    <svg
                      className={styles.dropdownIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#626c71"
                      strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <ul className={styles.customOptions}>
                      {deleteReasonOptions.map((option) => (
                        <li
                          key={option.value}
                          className={styles.customOption}
                          onClick={() => handleSelectReason(option.value)}>
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 기타 선택 시 textarea */}
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
                  onClick={handleConfirmDelete}
                  className={styles.deleteModalConfirmBtn}
                  disabled={
                    !agreeChecked ||
                    deleteReason === "" ||
                    (deleteReason === "etc" && customReason.trim() === "") // ← 추가
                  }>
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
