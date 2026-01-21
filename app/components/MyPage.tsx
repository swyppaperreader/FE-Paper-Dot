"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./MyPage.module.css";
import Footer from "./footer/Footer";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "txt";
  date: string;
  size: string;
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<
    "documents" | "account" | "privacy"
  >("documents");

  const mockUser = {
    id: "12345",
    name: "김유저",
    email: "username@kakao.com",
    profileImage: "/UserLogo.png",
    joinDate: "2025-01-15",
    subscription: "premium",
  };

  // 초기값: 빈 배열 (데이터 없음)
  const [documents, setDocuments] = useState<Document[]>([]);

  // 최근 읽은 문서 (데이터가 있을 때만 사용)
  const latestDocument = documents.length > 0 ? documents[0] : null;

  const renderDocuments = () => (
    <div className={styles.section}>
      {documents.length === 0 ? (
        <>
          {/* 📌 상단: 읽은 문서가 없을 때 메시지 */}
          <div className={styles.emptyStatePrompt}>
            <p className={styles.emptyStatePromptTitle}>
              읽은 문서가 생기면 이곳에 자동으로 모여요.
            </p>
            <div className={styles.emptyStatePromptBox}>
              <p className={styles.emptyStatePromptText}>
                업로드 된 파일이 없습니다.
                <br />
                텍스트 또는 파일을 번역하고 관리해보세요
              </p>
              <button className={styles.emptyStatePromptButton}>
                지금 시작하기
              </button>
            </div>
          </div>

          {/* 📌 하단: 최근 읽은 문서 섹션 (빈 상태) */}
          <div className={styles.emptyStateSection}>
            <h2 className={styles.recentDocumentsTitle}>최근 읽은 문서</h2>
            <p className={styles.emptyStateSubMessage}>
              최근 읽은 문서가 없습니다.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* 📌 데이터 있을 때: 최근 문서 제안 메시지 */}
          <div className={styles.recentDocumentPrompt}>
            <p className={styles.recentDocumentPromptText}>
              {mockUser.name}님, <strong>[{latestDocument?.name}]</strong>를
              이어서 볼까요?
            </p>
          </div>

          {/* 최근 읽은 문서 테이블 */}
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
                        className={`${styles.fileBadge} ${
                          doc.type === "pdf"
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

      {/* 프로필 + 로그아웃 - 한 줄 배치 */}
      <div className={styles.accountTopBar}>
        <div className={styles.accountProfileBar}>
          <div className={styles.accountProfileImageSmall}>
            <Image
              src="/UserLogo.png"
              alt="프로필"
              width={80}
              height={80}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              priority
            />
          </div>
          <h2 className={styles.accountProfileNameSmall}>{mockUser.name}</h2>
        </div>
        <button className={styles.accountLogoutBtnTop}>로그아웃</button>
      </div>

      {/* 소셜 로그인 ~ 입력필드 섹션 */}
      <div className={styles.accountFormSection}>
        {/* 소셜 로그인 행 */}
        <div className={styles.accountFormRow}>
          <label className={styles.accountFormLabel}>소셜 로그인</label>
          <div className={styles.accountSocialLoginRight}>
            <Image
              src="/KakaoLogo.png"
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

        {/* 이름 입력 행 */}
        <div className={styles.accountFormRow}>
          <label className={styles.accountFormLabel}>이름</label>
          <input
            type="text"
            defaultValue={mockUser.name}
            className={styles.accountInput}
            placeholder="이름 입력"
          />
        </div>

        {/* 이메일 입력 행 */}
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
    </div>
  );

  const renderPrivacySecurity = () => (
    <div className={styles.section}>
      <div className={styles.profileWithLogout}>
        <div className={styles.profileWrapper}>
          <div className={styles.profileImage}>
            <Image
              src="/UserLogo.png"
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
              src="/KakaoLogo.png"
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
          <button className={styles.headerButton}>+ 새 문서 만들기</button>
          <div className={styles.headerProfileImage}>
            <Image
              src="/UserLogo.png"
              alt="프로필"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.buttonGroup}>
            <div className={styles.sidebarGroupLabel}>내 문서</div>
            <button
              onClick={() => setActiveTab("documents")}
              className={`${styles.tabButton} ${
                activeTab === "documents"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}>
              내 문서함
            </button>

            <div className={styles.sidebarGroupLabel}>내 정보</div>
            <button
              onClick={() => setActiveTab("account")}
              className={`${styles.tabButton} ${
                activeTab === "account"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}>
              계정 정보
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`${styles.tabButton} ${
                activeTab === "privacy"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}>
              개인정보 & 보안
            </button>
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={styles.contentBox}>
            {activeTab === "documents" && renderDocuments()}
            {activeTab === "account" && renderAccountInfo()}
            {activeTab === "privacy" && renderPrivacySecurity()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
