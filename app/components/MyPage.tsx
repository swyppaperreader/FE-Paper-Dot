'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import styles from './MyPage.module.css';

export default function MyPage() {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'account' | 'privacy'>('account');

  // 더미 사용자 데이터
  // TODO: 로그인 완료 후 context/store에서 실제 사용자 데이터 가져오기
  // const { user } = useAuth();
  const mockUser = {
    id: '12345',
    name: '김유저',
    email: 'username@kakao.com',
    profileImage: '/profile-placeholder.jpg',
    joinDate: '2025-01-15',
    subscription: 'premium'
  };

  // 계정정보 섹션
  const renderAccountInfo = () => (
    <div className={styles.section}>
      {/* 프로필 섹션 */}
      <div className={`${styles.profileSection} ${styles.profileSectionNoBorder}`}>
        <div className={styles.profileImage}>
          <span>프로필</span>
        </div>
        <h2 className={styles.profileName}>{mockUser.name}</h2>
      </div>

      {/* 닉네임 입력 */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          <span className={styles.labelNumber}>6</span>닉네임
        </label>
        <input
          type="text"
          defaultValue={mockUser.name}
          className={styles.input}
          placeholder="닉네임 입력"
        />
      </div>

      {/* 계정이메일 입력 */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          <span className={styles.labelNumber}>7</span>계정이메일
        </label>
        <input
          type="email"
          defaultValue={mockUser.email}
          className={`${styles.input} ${styles.inputDisabled}`}
          placeholder="이메일 입력"
          disabled
        />
      </div>

      {/* 카카오로그인 */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          <span className={styles.labelNumber}>8</span>카카오로그인
        </label>
        <button className={styles.kakaoButton}>
          카카오로그인
        </button>
      </div>

      {/* 로그아웃 버튼 - 오른쪽 상단 */}
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton}>
          로그아웃
        </button>
      </div>
    </div>
  );

  // 개인정보&보안 섹션
  const renderPrivacySecurity = () => (
    <div className={styles.section}>
      {/* 프로필 섹션 - 로그아웃 버튼과 함께 */}
      <div className={styles.profileWithLogout}>
        <div className={styles.profileWrapper}>
          <div className={styles.profileImage}>
            <span>프로필</span>
          </div>
          <h2 className={styles.profileName}>{mockUser.name}</h2>
        </div>
        {/* 로그아웃 버튼 - 프로필 오른쪽 */}
        <button className={styles.logoutButton}>
          로그아웃
        </button>
      </div>

      {/* 회원탈퇴 버튼 - 프로필 아래 */}
      <div className={styles.deleteAccountContainer}>
        <button className={styles.deleteAccountButton}>
          회원탈퇴
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 회색 헤더 */}
      <header className={styles.header}>
        {/* 왼쪽: 서비스 이름 */}
        <div className={styles.headerLeft}>
          <div className={styles.serviceName}>서비스 이름(paperdot)</div>
        </div>

        {/* 가운데: 홈, 내문서함 */}
        <div className={styles.headerCenter}>
          <button className={styles.headerButton}>홈</button>
          <button className={styles.headerButton}>내문서함</button>
        </div>

        {/* 오른쪽: 새문서만들기, 유저이름 */}
        <div className={styles.headerRight}>
          <button className={styles.headerButton}>+ 새 문서 만들기</button>
          <button className={styles.headerButton}>{mockUser.name}</button>
        </div>
      </header>

      {/* Navigation 대신 여기에 배치 */}

      <div className={styles.contentWrapper}>
        {/* 왼쪽 사이드바 */}
        <div className={styles.sidebar}>
          <div className={styles.buttonGroup}>
            {/* 계정정보 버튼 */}
            <button
              onClick={() => setActiveTab('account')}
              className={`${styles.tabButton} ${activeTab === 'account'
                ? styles.tabButtonActive
                : styles.tabButtonInactive
                }`}
            >
              계정정보
            </button>

            {/* 개인정보&보안 버튼 */}
            <button
              onClick={() => setActiveTab('privacy')}
              className={`${styles.tabButton} ${activeTab === 'privacy'
                ? styles.tabButtonActive
                : styles.tabButtonInactive
                }`}
            >
              개인정보&보안
            </button>
          </div>
        </div>

        {/* 오른쪽 콘텐츠 */}
        <div className={styles.contentArea}>
          <div className={styles.contentBox}>
            {activeTab === 'account' && renderAccountInfo()}
            {activeTab === 'privacy' && renderPrivacySecurity()}
          </div>
        </div>
      </div>
    </div>
  );
}
