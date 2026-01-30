"use client";

import React from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Sidebar from "@/app/mypage/sidebar/page";
import { usePathname } from "next/navigation";
import ReadHeader from "../header/ReadHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
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
