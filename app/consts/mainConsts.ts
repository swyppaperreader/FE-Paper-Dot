interface TargetUser {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  imageSrc: string;
}

interface Step {
  id: number;
  description: React.ReactNode; // string 대신 ReactNode로 변경
}

export interface ThirdMainScreenBlock {
  id: string;
  layout: "text-image" | "image-text";
  title: string;
  /** `<br />`로 이어 붙일 문단 조각 */
  descriptionLines: string[];
  imageSrc: string;
  imageAlt: string;
  aspectRatio: string;
}



export const targetUsers: TargetUser[] = [
  {
    id: "student",
    title: "논문을 읽는\n대학생 또는 연구자",
    description: "",
    bulletPoints: [
      "“어디까지 읽었지?” 하며 같은 문장을 반복해서 찾아야 하는 사람",
    ],
    imageSrc: "/mainforth-first.png",
  },
  {
    id: "highschool",
    title: "수능 영어 지문을\n분석하고 싶은 고3",
    description: "",
    bulletPoints: [
      "긴 영어 지문을 볼 때마다 번역과 교재를 번갈아 보느라 집중이 자주 끊기는 학생",
    ],
    imageSrc: "/mainforth-second.png",
  },
  {
    id: "professional",
    title: "영어 텍스트를\n소비하는 실무자",
    description: "",
    bulletPoints: [
      "리포트, 매뉴얼, 뉴스레터, 리서치 아티클 등 영어 텍스트를 자주 읽는 직장인, 취준생",
    ],
    imageSrc: "/mainforth-third.png",
  },
];

export const steps: Step[] = [
  {
    id: 1,
    description: "읽고 싶은 영어 PDF를 업로드하거나,\n텍스트를 불러옵니다.",
  },
  {
    id: 2,
    description: "문장별로 번역된 텍스트를 읽습니다.",
  },
  {
    id: 3,
    description:
      "다 읽지 못한 문서는 내 문서함에 저장되어, 마지막 위치부터 이어 읽을 수 있습니다.",
  },
];

export const thirdMainScreenBlocks: ThirdMainScreenBlock[] = [
  {
    id: "faster-reading",
    layout: "text-image",
    title: "문장별 번역으로 더 빠르게 읽기",
    descriptionLines: [
      "번역창과 원문을 왔다 갔다 왕복할 필요가 없습니다.",
      "한 줄씩 나란히 정렬된 문장별 번역으로 영어 논문을",
      "지금보다 훨씬 빠르게 읽을 수 있습니다.",
    ],
    imageSrc: "/thirdBackgroundImage1.png",
    imageAlt: "메인페이지 1번째 이미지",
    aspectRatio: "800/394",
  },
  {
    id: "continue-reading",
    layout: "image-text",
    title: "내 문서함에서 이어서 읽기",
    descriptionLines: [
      "한 번 열어본 논문은 자동으로 내 문서함에 저장되어,",
      "다음에 열었을 때 마지막으로 보던 지점에서 바로 이어서",
      "읽을 수 있습니다.",
    ],
    imageSrc: "/thirdBackgroundImage2.png",
    imageAlt: "메인페이지 2번째 이미지",
    aspectRatio: "572/394",
  },
  {
    id: "pdf-jump",
    layout: "text-image",
    title: "PDF 뷰어로 원하는 곳에 즉시 점프",
    descriptionLines: [
      "논문 전체를 스크롤로 훑을 필요 없이,",
      "PDF 뷰어에서 전체 문서를 관리하고 보고 싶은 페이지로 한 번에",
      "점프할 수 있습니다.",
    ],
    imageSrc: "/thirdBackgroundImage3.png",
    imageAlt: "메인페이지 3번째 이미지",
    aspectRatio: "572/394",
  },
];
