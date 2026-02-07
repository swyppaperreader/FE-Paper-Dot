"use client";

import { useDocumentStore } from "@/app/store/useDocument";
import { useEffect, useState } from "react";
import ReadHeader from "../../header/ReadHeader";

interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

export default function ReadList() {
  const getDocumentId = useDocumentStore((state) => state.documentId);
  const [translationPairs, setTranslationPairs] = useState<TranslationPair[]>(
    []
  );

  useEffect(() => {
    const fetchDocument = async () => {
      const response = await fetch(
        `https://be-paper-dot.store/api/v1/documents/${getDocumentId}/translation-pairs`
      );
      const data = await response.json();
      setTranslationPairs(data);
      console.log(data);
    };
    fetchDocument();
  }, [getDocumentId]);

  console.log(translationPairs);

  return (
    <div>
      <ReadHeader />
    </div>
  );
}
