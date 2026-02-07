"use client";

import { useState } from "react";
import ReadHeader from "../../header/ReadHeader";

export default function ReadList() {
  const [data] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("translationPairs");
    return stored ? JSON.parse(stored) : [];
  });

  const [fileName] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("fileName") ?? "";
  });

  console.log(data);
  console.log(fileName);

  return (
    <div>
      <ReadHeader fileName={fileName} />
    </div>
  );
}
