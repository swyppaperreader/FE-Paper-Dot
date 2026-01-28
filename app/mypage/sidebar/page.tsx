import React, { useState } from "react";
import styles from "@/app/components/mypage/ui/MyPage.module.css";
import Image from "next/image";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<"documents" | "account">(
    "documents"
  );
  return (
    <>
      {/* 사이드바 */}
      <div className={styles.sidebar}>
        <div className={styles.buttonGroup}>
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
    </>
  );
}
