"use client";

import { useEffect, useState } from "react";
import ReadHeader from "../../header/ReadHeader";

interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

export default function ReadList() {
  const [translationPairs, setTranslationPairs] = useState<TranslationPair[]>(
    []
  );

  useEffect(() => {
    const id = sessionStorage.getItem("documentId");
    if (!id) return;
    const fetchTranslationPairs = async () => {
      const response = await fetch(
        `https://be-paper-dot.store/api/v1/documents/${id}/translation-pairs`
      );
      const data = await response.json();
      setTranslationPairs(Array.isArray(data) ? data : data?.data ?? []);
    };
    fetchTranslationPairs();
  }, []);

  console.log(translationPairs);

  return (
    <div>
      <ReadHeader />
    </div>
  );
}
