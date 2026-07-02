"use client";

import React from "react";
import Footer from "@/app/components/footer/Footer";
import Header from "@/app/components/header/Header";
import Sidebar from "@/app/components/mypage/Sidebar";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isMypage =
    pathname === "/mypage/mydocument" || pathname === "/mypage/account";

  const showHeaderFooter = pathname === "/" || isMypage;
  const showHeaderOnly = pathname === "/newdocument";

  return (
    <>
      {(showHeaderFooter || showHeaderOnly) && <Header />}
      {isMypage ? (
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
          <Sidebar />
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
      {showHeaderFooter && <Footer />}
    </>
  );
}
