import React from "react";
import Image from "next/image";
import styles from "./forthMainScreen.module.css";

interface TargetUser {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  imageSrc: string;
}

const targetUsers: TargetUser[] = [
  {
    id: "student",
    title: "논문을 읽는\n대학생 또는 연구자",
    description: "",
    bulletPoints: [
      "“어디까지 읽었지?” 하며 같은 문장을 반복해서 찾아야 하는 사람"
    ],
    imageSrc: "/mainforth-first.svg",
  },
  {
    id: "highschool",
    title: "수능 영어 지문을\n분석하고 싶은 고3",
    description: "",
    bulletPoints: [
      "긴 영어 지문을 볼 때마다 번역과 교재를 번갈아 보느라 집중이 자주 끊기는 학생"
    ],
    imageSrc: "/mainforth-second.svg",
  },
  {
    id: "professional",
    title: "영어 텍스트를\n소비하는 실무자",
    description: "",
    bulletPoints: [
      "리포트, 매뉴얼, 뉴스레터, 리서치 아티클 등 영어 텍스트를 자주 읽는 직장인, 취준생"
    ],
    imageSrc: "/mainforth-third.svg",
  },
];

export default function CheckSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.mainTitle}>
            번역기를 열고, 복사하고, 다시 돌아오는 시간이
            <br />
            아까웠던 사람들을 위해 만들었습니다.
          </h2>
        </div>

        <div className={styles.cardsGrid}>
          {targetUsers.map((user) => (
            <div key={user.id} className={styles.cardWrapper}>
              {/* 회색 정사각형 영역 */}
              <div className={styles.imageArea}>
                <Image src={user.imageSrc} alt={user.title} fill priority />
              </div>

              {/* 텍스트 영역 */}
              <div className={styles.contentArea}>
                <h3 className={styles.cardTitle}>{user.title}</h3>
                <ul className={styles.bulletList}>
                  {user.bulletPoints.map((point, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
