"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./MyPage.module.css";
import Footer from "./footer/Footer";

interface Document {
  id: string;
  name: string;
  type: "pdf";
  date: string;
  size: string;
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<
    "documents" | "account" | "privacy"
  >("documents");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const mockUser = {
    id: "12345",
    name: "김유저",
    email: "testid@kakao.com",
    profileImage: "/user-default.png",
    joinDate: "2025-01-15",
    subscription: "premium",
  };

  const [documents, setDocuments] = useState<Document[]>([]);
  const latestDocument = documents.length > 0 ? documents[0] : null;

  // 프로필 메뉴 토글
  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // 프로필 메뉴 닫기
  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  // 회원탈퇴 핸들러
  const handleDeleteAccount = async () => {
    if (!showDeleteModal) {
      setShowDeleteModal(true);
      return;
    }

    try {
      console.log("회원탈퇴 진행 중...");
      setTimeout(() => {
        alert("회원탈퇴가 완료되었습니다.");
      }, 1000);

      setShowDeleteModal(false);
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
      setShowDeleteModal(false);
    }
  };

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
              <button className={styles.emptyStatePromptButton}>
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
              {documents.map((doc) => (
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
        </>
      )}
    </div>
  );

  const renderAccountInfo = () => (
    <div className={styles.section}>
      <div className={styles.accountHeader}>
        <h1 className={styles.accountTitle}>계정 정보 확인</h1>
      </div>

      <div className={styles.accountTopBar}>
        <div className={styles.accountProfileBar}>
          <div className={styles.accountProfileImageSmall}>

          </div>
          <h2 className={styles.accountProfileNameSmall}>{mockUser.name}</h2>
        </div>
        <button className={styles.accountLogoutBtnTop}>로그아웃</button>
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

  const renderPrivacySecurity = () => (
    <div className={styles.section}>
      <div className={styles.profileWithLogout}>
        <div className={styles.profileWrapper}>
          <div className={styles.profileImage}>
            <Image
              src="/account-inactive.png"
              alt="프로필"
              width={80}
              height={80}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              priority
            />
          </div>
          <div>
            <h2 className={styles.profileName}>{mockUser.name}</h2>
            <p className={styles.profileJoinDate}>소셜 로그인</p>
          </div>
        </div>
        <button className={styles.logoutButton}>로그아웃</button>
      </div>

      <div className={styles.cardGroup}>
        <div className={styles.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Image
              src="/kakaoLogo.svg"
              alt="카카오"
              width={32}
              height={32}
              priority
            />
            <p className={styles.cardTitle}>카카오톡 연동 로그인</p>
          </div>
        </div>
      </div>

      <div className={styles.deleteAccountContainer}>
        <button className={styles.deleteAccountButton}>회원탈퇴</button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
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
          <button className={styles.headerButton}>새 문서로 이동하기</button>
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

            {showProfileMenu && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileDropdownHeader}>
                  <h3 className={styles.profileDropdownName}>{mockUser.name}</h3>
                  <p className={styles.profileDropdownEmail}>{mockUser.email}</p>
                </div>
                <div className={styles.profileDropdownDivider} />
                <button
                  className={styles.profileDropdownItem}
                  onClick={() => {
                    setActiveTab("documents");
                    closeProfileMenu();
                  }}>
                  내 문서함
                </button>
                <button
                  className={styles.profileDropdownItem}
                  onClick={() => {
                    setActiveTab("account");
                    closeProfileMenu();
                  }}>
                  내 계정
                </button>
                <div className={styles.profileDropdownDivider} />
                <button className={styles.profileDropdownLogout}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showProfileMenu && (
        <div
          className={styles.profileMenuBackdrop}
          onClick={closeProfileMenu}
        />
      )}

      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => setActiveTab("documents")}
              className={`${styles.tabButton} ${activeTab === "documents"
                ? styles.tabButtonActive
                : styles.tabButtonInactive
                }`}>
              <Image
                src={activeTab === "documents" ? "/file-active.png" : "/file-inactive.png"}
                alt="문서함"
                width={20}
                height={20}
                style={{ marginRight: "8px" }}
              />
              내 문서함
            </button>

            <button
              onClick={() => setActiveTab("account")}
              className={`${styles.tabButton} ${activeTab === "account"
                ? styles.tabButtonActive
                : styles.tabButtonInactive
                }`}>
              <Image
                src={activeTab === "account" ? "/account-active.png" : "/account-inactive.png"}
                alt="계정"
                width={20}
                height={20}
                style={{ marginRight: "8px" }}
              />
              내 계정
            </button>
          </div>
        </div>

        <div className={styles.contentArea}>
          {activeTab === "documents" && renderDocuments()}
          {activeTab === "account" && renderAccountInfo()}
          {activeTab === "privacy" && renderPrivacySecurity()}
        </div>
      </div>

      <Footer />
    </div>
  );
}
