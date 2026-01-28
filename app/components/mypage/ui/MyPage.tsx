"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./MyPage.module.css";
import { useRouter } from "next/navigation";
import MyDocument from "@/app/mypage/mydocument/page";
import MyAccount from "@/app/mypage/account/page";

interface Document {
  id: string;
  name: string;
  type: "pdf";
  date: string;
  size: string;
}

export default function MyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"documents" | "account">(
    "documents"
  );

  // ⭐ 상태 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  // ⭐ 탈퇴 사유 관련 상태 (한 화면에서 모두 처리)
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [agreeToDelete, setAgreeToDelete] = useState(false);

  const deleteReasons = [
    "더 이상 사용할 일이 없어서",
    "필요한 기능이 없어서 (하이라이트, 단어장 등)",
    "다른 서비스(번역기, ai)를 이용해서",
    "번역 품질이 기대에 미치지 못해서",
    "기타(직접입력)",
  ];

  const mockUser = {
    id: "12345",
    name: "김유저",
    email: "testid@kakao.com",
    profileImage: "/user-default.png",
    joinDate: "2025-01-15",
    subscription: "premium",
  };

  const [documents, setDocuments] = useState<Document[]>([]);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDocuments = documents.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const latestDocument = documents.length > 0 ? documents[0] : null;

  // ⭐ 새 문서 만들기 핸들러
  const handleStartNewDocument = () => {
    router.push("/newdocument");
  };

  // 프로필 메뉴 닫기
  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  // ⭐ 내 문서함 버튼 핸들러
  const handleMyDocuments = () => {
    setActiveTab("documents");
    closeProfileMenu();
    setCurrentPage(1);
  };

  // ⭐ 내 계정 버튼 핸들러
  const handleMyAccount = () => {
    setActiveTab("account");
    closeProfileMenu();
  };

  // ⭐ 로그아웃 버튼 핸들러 (팝업 표시)
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // ⭐ 로그아웃 확인
  const handleLogoutConfirm = async () => {
    try {
      console.log("로그아웃 진행 중...");

      setTimeout(() => {
        alert("로그아웃되었습니다.");
        setShowLogoutModal(false);
        closeProfileMenu();
        router.push("/login");
      }, 500);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
      setShowLogoutModal(false);
    }
  };

  // ⭐ 로그아웃 취소
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // ⭐ 탈퇴하기 버튼 클릭 (한 화면 모달 표시)
  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true);
    setSelectedReason("");
    setCustomReason("");
    setAgreeToDelete(false);
  };

  // ⭐ 탈퇴 확인
  const handleConfirmDelete = async () => {
    if (!agreeToDelete) {
      alert("약관에 동의해주세요.");
      return;
    }
    if (!selectedReason) {
      alert("탈퇴 사유를 선택해주세요.");
      return;
    }
    if (selectedReason === "기타(직접입력)" && !customReason.trim()) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }

    try {
      const reason =
        selectedReason === "기타(직접입력)" ? customReason : selectedReason;

      console.log("탈퇴 사유:", reason);

      // API 호출
      // await fetch('/api/user/delete', {
      //   method: 'DELETE',
      //   body: JSON.stringify({ reason })
      // });

      alert("회원탈퇴가 완료되었습니다.");
      setShowDeleteModal(false);
      router.push("/login");
    } catch (error) {
      console.error("탈퇴 실패:", error);
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  };

  // ⭐ 메인 렌더
  return (
    <div className={styles.contentWrapper}>
      {/* 사이드바 */}
      <div className={styles.sidebar}>
        <div className={styles.buttonGroup}>
          {/* 내 문서함 탭 버튼 */}
          <button
            onClick={() => setActiveTab("documents")}
            className={`${styles.tabButton} ${
              activeTab === "documents"
                ? styles.tabButtonActive
                : styles.tabButtonInactive
            }`}>
            <Image
              src={
                activeTab === "documents"
                  ? "/file-active.png"
                  : "/file-inactive.png"
              }
              alt="문서함"
              width={20}
              height={20}
              style={{ marginRight: "8px" }}
            />
            내 문서함
          </button>

          {/* 내 계정 탭 버튼 */}
          <button
            onClick={() => setActiveTab("account")}
            className={`${styles.tabButton} ${
              activeTab === "account"
                ? styles.tabButtonActive
                : styles.tabButtonInactive
            }`}>
            <Image
              src={
                activeTab === "account"
                  ? "/account-active.png"
                  : "/account-inactive.png"
              }
              alt="계정"
              width={20}
              height={20}
              style={{ marginRight: "8px" }}
            />
            내 계정
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.contentArea}>
        {activeTab === "documents" && <MyDocument />}
        {activeTab === "account" && <MyAccount />}
      </div>
    </div>
  );
}
