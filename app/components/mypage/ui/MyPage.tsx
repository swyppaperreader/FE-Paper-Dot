"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./MyPage.module.css";
import Footer from "../../../components/footer/Footer";
import { useRouter } from "next/navigation";

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
  const currentDocuments = documents.slice(startIndex, startIndex + itemsPerPage);
  const latestDocument = documents.length > 0 ? documents[0] : null;

  // ⭐ 새 문서 만들기 핸들러
  const handleStartNewDocument = () => {
    router.push("/newdocument");
  };

  // 프로필 메뉴 토글
  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
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

  // ⭐ 모달 닫기
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedReason("");
    setCustomReason("");
    setAgreeToDelete(false);
  };

  // ⭐ 한 화면 통합 탈퇴 모달
  const renderDeleteModal = () => (
    <div className={styles.deleteModal}>
      <div className={styles.deleteModalContent}>
        {/* 제목 */}
        <h2 className={styles.deleteModalTitle}>계정삭제</h2>

        {/* 설명 텍스트 */}
        <p className={styles.deleteModalDescription}>
          탈퇴 시 번역 기록, 내정보를 포함한 모든 데이터가 삭제되며 복구할 수
          없습니다.
        </p>

        {/* 동의 체크박스 */}
        <div className={styles.agreeCheckbox}>
          <input
            type="checkbox"
            id="agreeDelete"
            checked={agreeToDelete}
            onChange={(e) => setAgreeToDelete(e.target.checked)}
            className={styles.checkboxInput}
          />
          <label htmlFor="agreeDelete" className={styles.checkboxLabel}>
            동의합니다
          </label>
        </div>

        {/* 구분선 */}
        <div className={styles.deleteModalDivider} />

        {/* 탈퇴 사유 섹션 */}
        <div className={styles.deleteReasonSection}>
          <label className={styles.deleteReasonLabel}>계정 삭제 사유</label>

          {/* 선택 박스 */}
          <div className={styles.selectWrapper}>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className={styles.deleteReasonSelect}
              disabled={!agreeToDelete}>
              <option value="">계정 삭제 이유를 선택해주세요</option>
              {deleteReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* 기타 선택 시 텍스트 입력 */}
          {selectedReason === "기타(직접입력)" && agreeToDelete && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="탈퇴 사유를 작성해주세요"
              className={styles.customReasonTextarea}
              maxLength={500}
            />
          )}
        </div>

        {/* 하단 버튼 */}
        <div className={styles.deleteModalButtons}>
          <button
            onClick={handleCloseModal}
            className={styles.deleteModalCancelBtn}>
            취소
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={!agreeToDelete}
            className={`${styles.deleteModalConfirmBtn} ${!agreeToDelete ? styles.deleteModalConfirmBtnDisabled : ""
              }`}>
            계정삭제
          </button>
        </div>
      </div>
    </div>
  );

  // ⭐ 문서함 렌더 함수 (페이지네이션 적용)
  const renderDocuments = () => (
    <div className={styles.section}>
      {documents.length === 0 ? (
        <>
          <div className={styles.emptyStatePrompt}>
            <p className={styles.emptyStatePromptTitle}>
              읽은 문서가 생기면 이곳에 자동으로 모여요.
            </p>
            <div className={styles.emptyStatePromptBox}>
              <p className={styles.emptyStatePromptText}>
                업로드 된 파일이 없습니다.
                <br />
                파일을 번역하고 관리해보세요
              </p>
              <button
                className={styles.emptyStatePromptButton}
                onClick={handleStartNewDocument}>
                지금 시작하기
              </button>
            </div>
          </div>

          <div className={styles.emptyStateSection}>
            <h2 className={styles.recentDocumentsTitle}>최근 읽은 문서</h2>
            <p className={styles.emptyStateSubMessage}>
              최근 읽은 문서가 없습니다.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className={styles.recentDocumentPrompt}>
            <p className={styles.recentDocumentPromptText}>
              {mockUser.name}님, <strong>[{latestDocument?.name}]</strong>를
              이어서 볼까요?
            </p>
          </div>

          <h2 className={styles.recentDocumentsTitle}>최근 읽은 문서</h2>
          <div className={styles.tableContainer}>
            <table className={styles.documentsTable}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell} style={{ width: "40%" }}>
                    파일명
                  </th>
                  <th className={styles.tableHeaderCell} style={{ width: "20%" }}>
                    날짜
                  </th>
                  <th className={styles.tableHeaderCell} style={{ width: "20%" }}>
                    용량
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentDocuments.map((doc) => (
                  <tr key={doc.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}>
                        <span
                          className={`${styles.fileBadge} ${doc.type === "pdf"
                            ? styles.fileBadgePdf
                            : styles.fileBadgeTxt
                            }`}>
                          {doc.type.toUpperCase()}
                        </span>
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>{doc.date}</td>
                    <td className={styles.tableCell}>{doc.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ""
                    }`}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}>
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ""
                      }`}
                    onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button
                  className={`${styles.pageBtn} ${currentPage === totalPages ? styles.pageBtnDisabled : ""
                    }`}
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}>
                  ›
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  // ⭐ 계정 정보 렌더 함수
  const renderAccountInfo = () => (
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
      </div>

      <div className={styles.accountDivider} />

      <div className={styles.accountManagementSection}>
        <button
          onClick={handleDeleteAccountClick}
          className={styles.deleteAccountLink}>
          탈퇴하기
        </button>

        {/* ⭐ 한 화면 통합 탈퇴 모달 */}
        {showDeleteModal && renderDeleteModal()}
      </div>
    </div>
  );

  // ⭐ 메인 렌더
  return (
    <div className={styles.container}>
      {/* ==================== 헤더 ==================== */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoContainer}>
            <Image
              src="/Paperdot.logo.png"
              alt="Paperdot 로고"
              width={100}
              height={32}
              className={styles.logoImage}
              priority
            />
          </div>
        </div>

        <div className={styles.headerCenter} />

        <div className={styles.headerRight}>
          <button
            className={styles.headerButton}
            onClick={handleStartNewDocument}>
            새 문서 만들기
          </button>

          {/* ==================== 프로필 메뉴 ==================== */}
          <div className={styles.profileMenuWrapper}>
            <button
              className={styles.headerProfileImage}
              onClick={handleProfileMenuToggle}>
              <Image
                src="/user-default.png"
                alt="프로필"
                width={40}
                height={40}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                priority
              />
            </button>

            {/* 프로필 드롭다운 메뉴 */}
            {showProfileMenu && (
              <>
                {/* 배경 (가장 아래) */}
                <div
                  className={styles.profileMenuBackdrop}
                  onClick={closeProfileMenu}
                />

                {/* 드롭다운 (배경 위) */}
                <div className={styles.profileDropdown}>
                  <div className={styles.profileDropdownHeader}>
                    <h3 className={styles.profileDropdownName}>
                      {mockUser.name}
                    </h3>
                  </div>
                  <div className={styles.profileDropdownDivider} />
                  {/* 내 문서함 버튼 */}
                  <button
                    className={styles.profileDropdownItem}
                    onClick={handleMyDocuments}>
                    내 문서함
                  </button>
                  {/* 내 계정 버튼 */}
                  <button
                    className={styles.profileDropdownItem}
                    onClick={handleMyAccount}>
                    내 계정
                  </button>
                  <div className={styles.profileDropdownDivider} />
                  {/* 로그아웃 버튼 */}
                  <button
                    className={styles.profileDropdownLogout}
                    onClick={handleLogoutClick}>
                    로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ==================== 로그아웃 확인 팝업 ==================== */}
      {showLogoutModal && (
        <div className={styles.logoutModal}>
          <div className={styles.logoutModalContent}>
            <h2 className={styles.logoutModalTitle}>로그아웃</h2>
            <p className={styles.logoutModalMessage}>
              정말로 로그아웃 하시겠습니까?
            </p>
            <div className={styles.logoutModalButtons}>
              <button
                onClick={handleLogoutCancel}
                className={styles.logoutModalCancelBtn}>
                취소
              </button>
              <button
                onClick={handleLogoutConfirm}
                className={styles.logoutModalConfirmBtn}>
                로그아웃
              </button>
            </div>
          </div>
          <div
            className={styles.logoutModalBackdrop}
            onClick={handleLogoutCancel}
          />
        </div>
      )}

      {/* ==================== 콘텐츠 영역 ==================== */}
      <div className={styles.contentWrapper}>
        {/* 사이드바 */}
        <div className={styles.sidebar}>
          <div className={styles.buttonGroup}>
            {/* 내 문서함 탭 버튼 */}
            <button
              onClick={() => setActiveTab("documents")}
              className={`${styles.tabButton} ${activeTab === "documents"
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
              className={`${styles.tabButton} ${activeTab === "account"
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
          {activeTab === "documents" && renderDocuments()}
          {activeTab === "account" && renderAccountInfo()}
        </div>
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}