"use client";

import { useEffect, useState } from "react";
import ReadHeader from "../../header/ReadHeader";

interface TranslationPair {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

export default function ReadList() {
  const [data, setData] = useState<TranslationPair[]>([]);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const storedPairs = sessionStorage.getItem("translationPairs");
    const storedFileName = sessionStorage.getItem("fileName");

    if (storedPairs) {
      setData(JSON.parse(storedPairs));
    }

    if (storedFileName) {
      setFileName(JSON.parse(storedFileName));
    }
  }, []);

  console.log(data);
  console.log(fileName);

  return (
    <div>
      <ReadHeader />
    </div>
  );
}
