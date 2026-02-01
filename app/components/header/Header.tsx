import Link from "next/link";
import Image from "next/image"; // ← 여기서 가져와야 함
import styles from "./header.module.css";
import HeaderModal from "../modal/HeaderModal";
import { useEffect, useState } from "react";
import { getToken } from "@/app/api/users/route";

export default function Header() {
  const isLogin = false;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const result = await getToken();
      console.log(result);
    };
    fetchToken();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.link}>
          <Image
            src="/Logo.svg"
            alt="Paperdot 로고"
            width={106}
            height={40}
            priority
          />
        </Link>

        {isLogin ? (
          <HeaderModal />
        ) : (
          <Link href="/login" className={styles.button}>
            로그인/회원가입
          </Link>
        )}
      </div>
    </header>
  );
}
