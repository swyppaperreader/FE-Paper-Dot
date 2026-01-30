"use client";

import React from "react";
import styles from "@/app/components/mypage/ui/MyPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    label: "내 문서함",
    icon: "/file-inactive.png",
    activeIcon: "/file-active.png",
    href: "/mypage/mydocument",
  },
  {
    label: "내 계정",
    icon: "/account-inactive.png",
    activeIcon: "/account-active.png",
    href: "/mypage/account",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* 사이드바 */}
      <aside className={styles.sidebar}>
        <div className={styles.buttonGroup}>
          {sidebarItems.map((item) => (
            <div className={styles.tabButtonContainer} key={item.label}>
              <Link
                href={item.href}
                className={`${styles.tabButton} ${
                  pathname === item.href ? styles.tabButtonActive : ""
                }`}>
                <Image
                  src={pathname === item.href ? item.activeIcon : item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={styles.tabButtonIcon}
                />
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
