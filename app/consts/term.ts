import styles from "@/app/login/login.module.css";

interface Term {
  href: string;
  title: string;
  className: string;
  target: string;
  rel: string;
}

export const TERMS: Term[] = [
  {
    href: "https://www.notion.so/2f4eb2f40de7802f8539e4762234b41d?source=copy_link",
    title: "개인정보처리방침",
    className: styles.termsLinkText,
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "https://www.notion.so/2fbeb2f40de780c5b996fc19312ca446?source=copy_link",
    title: "이용약관",
    className: styles.termsLinkText,
    target: "_blank",
    rel: "noopener noreferrer",
  },
];
