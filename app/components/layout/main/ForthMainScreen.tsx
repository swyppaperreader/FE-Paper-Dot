import styles from "./forthMainScreen.module.css";
import MainforthFirst from "@/public/mainforth-first.svg";
import MainforthSecond from "@/public/mainforth-second.svg";
import MainforthThird from "@/public/mainforth-third.svg";

interface TargetUser {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  ImageComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const targetUsers: TargetUser[] = [
  {
    id: "student",
    title: "논문을 읽는\n대학생 또는 연구자",
    description: "",
    bulletPoints: [
      "PDF와 번역기를 왔다 갔다 하느라 시간 낭비를 체감하는 사람",
      "매번 파일을 다시 열고 위치를 찾는 것이 번거로운 사람",
      '"어디까지 읽었지?" 하며 같은 문장을 두 번, 세 번 다시 찾는 경험이 있는 사람',
    ],
    ImageComponent: MainforthFirst,
  },
  {
    id: "highschool",
    title: "수능 영어 지문을\n분석하고 싶은 고3",
    description: "",
    bulletPoints: [
      "PDF와 번역기를 왔다 갔다 하느라 시간 낭비를 체감하는 사람",
      "매번 파일을 다시 열고 위치를 찾는 것이 번거로운 사람",
      '"어디까지 읽었지?" 하며 같은 문장을 두 번, 세 번 다시 찾는 경험이 있는 사람',
    ],
    ImageComponent: MainforthSecond,
  },
  {
    id: "professional",
    title: "영어 텍스트를\n소비하는 실무자",
    description: "",
    bulletPoints: [
      "PDF와 번역기를 왔다 갔다 하느라 시간 낭비를 체감하는 사람",
      "매번 파일을 다시 열고 위치를 찾는 것이 번거로운 사람",
      '"어디까지 읽었지?" 하며 같은 문장을 두 번, 세 번 다시 찾는 경험이 있는 사람',
    ],
    ImageComponent: MainforthThird,
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
                <user.ImageComponent className={styles.illustration} />
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
