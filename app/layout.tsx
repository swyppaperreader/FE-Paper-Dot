import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Paperdot - 영어 논문을 문장 단위로 번역하고 이해하는 가장 쉬운 방법",
  description:
    "논문, 전공서적, 리포트, 메뉴얼 등 다양한 영어 문서를 원문과 한글 번역을 문장 단위로 병렬 표시해 더 쉽고 빠르게 이해하세요.",
  keywords: [
    "논문 번역",
    "영어 번역",
    "문장 단위 번역",
    "PDF 번역",
    "학술 논문",
    "전공서적 번역",
  ],
  authors: [{ name: "Paperdot" }],
  openGraph: {
    title: "Paperdot - 영어 논문을 문장 단위로 번역하고 이해하는 가장 쉬운 방법",
    description:
      "논문, 전공서적, 리포트, 메뉴얼 등 다양한 영어 문서를 원문과 한글 번역을 문장 단위로 병렬 표시해 더 쉽고 빠르게 이해하세요.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paperdot - 영어 논문을 문장 단위로 번역하고 이해하는 가장 쉬운 방법",
    description:
      "논문, 전공서적, 리포트, 메뉴얼 등 다양한 영어 문서를 원문과 한글 번역을 문장 단위로 병렬 표시해 더 쉽고 빠르게 이해하세요.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
