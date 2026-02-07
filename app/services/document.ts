export const postDocuments = async (formData: FormData) => {
  try {
    const response = await fetch("https://be-paper-dot.store/documents", {
      method: "POST",
      body: formData,
    });

    console.log("response", response);

    if (!response.ok) {
      throw new Error("파일 업로드에 실패했습니다!");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "파일 업로드에 실패했습니다!");
  }
};

// 백엔드 API에서 이미 추출되고 번역된 문서 단위들을 가져오는 함수
export interface TranslatedDocumentUnit {
  docUnitId: number;
  sourceText: string;
  translatedText: string;
}

export const getTranslatedDocument = async (
  documentId: string | number
): Promise<TranslatedDocumentUnit[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://be-paper-dot.store";
    const response = await fetch(`${apiUrl}/api/documents/${documentId}/units`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("번역된 문서를 가져오는데 실패했습니다!");
    }

    const data: TranslatedDocumentUnit[] = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "번역된 문서를 가져오는데 실패했습니다!"
    );
  }
};
