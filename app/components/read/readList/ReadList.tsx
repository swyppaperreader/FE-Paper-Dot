"use client";

import { useState } from "react";
import ReadHeader from "../../header/ReadHeader";

interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

function getInitialPairs(): TranslationPair[] {
  try {
    return (
      (JSON.parse(
        sessionStorage.getItem("translationPairs") ?? "[]"
      ) as TranslationPair[]) || []
    );
  } catch {
    return [];
  }
}

export default function ReadList() {
  const [translationPairs] = useState<TranslationPair[]>(getInitialPairs);

  console.log(translationPairs);

  return (
    <div>
      <ReadHeader />
    </div>
  );
}
