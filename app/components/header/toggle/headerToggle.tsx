"use client";

import React, { useState } from "react";
import Button from "../../button/Button";
import styles from "../readHeader.module.css";

export default function HeaderToggle() {
  const [toggle, setToggle] = useState<"all" | "korean" | "english">("all");
  const buttonList = [
    { id: 1, mode: "all", text: "전체" },
    { id: 2, mode: "korean", text: "한글" },
    { id: 3, mode: "english", text: "영어" },
  ];

  const handleToggle = (mode: "all" | "korean" | "english") => {
    setToggle(mode);
  };

  return (
    <div className={styles.readHeaderFileNameContainer}>
      {buttonList.map((item) => (
        <Button
          className={
            toggle === item.mode
              ? styles.readHeaderFileNameButtonActive
              : styles.readHeaderFileNameButton
          }
          key={item.id}
          onClick={() =>
            handleToggle(item.mode as "all" | "korean" | "english")
          }>
          {item.text}
        </Button>
      ))}
    </div>
  );
}
