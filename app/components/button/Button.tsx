import styles from "./button.module.css";

export default function Button({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: string;
}) {
  return <button className={`${styles.button} ${style}`}>{children}</button>;
}
