import styles from "@/app/login/login.module.css";

interface LoginButtonText {
  provider: "google" | "kakao";
  icon: string;
  text: string;
  className: string;
}

export const LOGIN_BUTTON_TEXT: LoginButtonText[] = [
  {
    provider: "google",
    text: "구글로 시작하기",
    icon: "/googleLogo.svg",
    className: styles.googleButton,
  },
  {
    provider: "kakao",
    text: "카카오로 시작하기",
    icon: "/kakaoLogo.svg",
    className: styles.kakaoButton,
  },
];
