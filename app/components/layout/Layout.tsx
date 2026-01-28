"use client";

import React from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Sidebar from "@/app/mypage/sidebar/page";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isMypage =
    pathname === "/" ||
    pathname === "/mypage/mydocument" ||
    pathname === "/mypage/account";

  return (
    <>
      {isMypage && <Header />}
      {isMypage ? (
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
          <Sidebar />
          {children}
        </div>
      ) : (
        children
      )}
      {isMypage && <Footer />}
    </>
  );
}
