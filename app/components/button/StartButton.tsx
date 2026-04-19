"use client";

import Link from "next/link";
import { useLoginStore } from "@/app/store/useLogin";

export default function StartButton({ className }: { className?: string }) {
  const userInfo = useLoginStore((state) => state.userInfo);

  return (
    <Link
      className={className}
      href={userInfo?.nickname ? "/newdocument" : "/login"}>
      지금 시작하기
    </Link>
  );
}
