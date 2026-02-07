export const postDocuments = async (formData: FormData, accessToken?: string) => {
  try {
    const headers: HeadersInit = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch("https://be-paper-dot.store/api/v1/documents", {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    // HTML 응답 감지 (인증 실패 시 로그인 페이지 반환)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error("인증이 필요합니다. 로그인해주세요.");
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("인증이 필요합니다. 로그인해주세요.");
      }
      throw new Error("파일 업로드에 실패했습니다!");
    }
    const data = await response.json();
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
  documentId: string | number,
  accessToken?: string
): Promise<TranslatedDocumentUnit[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://be-paper-dot.store";
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${apiUrl}/api/v1/documents/${documentId}/units`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    // HTML 응답 감지 (인증 실패 시 로그인 페이지 반환)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error("인증이 필요합니다. 로그인해주세요.");
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("인증이 필요합니다. 로그인해주세요.");
      }
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
