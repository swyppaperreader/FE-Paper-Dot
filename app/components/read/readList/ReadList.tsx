"use client";

import { useState } from "react";
import ReadHeader from "../../header/ReadHeader";

interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

export default function ReadList() {
  const data = JSON.parse(sessionStorage.getItem("translationPairs") ?? "[]");
  const fileName = JSON.parse(sessionStorage.getItem("fileName") ?? "");

  console.log(data);
  console.log(fileName);

  return (
    <div>
      <ReadHeader />
    </div>
  );
}
