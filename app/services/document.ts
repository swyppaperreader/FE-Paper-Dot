export const postDocuments = async (formData: FormData, accessToken?: string) => {
  try {
    const headers: HeadersInit = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch("https://be-paper-dot.store/documents", {
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

    const response = await fetch(`${apiUrl}/api/v1/documents/${documentId}/translation-pairs`, {
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

export const requestLLM = async (file: File, accessToken?: string) => {
  try {
    const headers: HeadersInit = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch("https://be-paper-dot.store/api/llm/chat-pdf", {
      method: "POST",
      headers,
      body: file,
      credentials: "include",
    });

    const text = await response.text();

    // HTML 응답 감지 (인증 실패 시 로그인 페이지 반환)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error("인증이 필요합니다. 로그인해주세요.");
    }

    if (!response.ok) {
      console.error("[requestLLM] 실패:", response.status, text);
      throw new Error(
        `LLM 요청 실패 (${response.status}): ${text.slice(0, 200)}`
      );
    }

    if (!text) {
      console.warn("[requestLLM] 응답 본문 없음");
      return { data: "" };
    }

    try {
      const data = JSON.parse(text);
      console.log("[requestLLM] 성공:", data);
      return data;
    } catch {
      // JSON이 아니면 텍스트 그대로 반환
      console.log("[requestLLM] 성공(텍스트):", text);
      return { data: text };
    }
  } catch (error) {
    throw new Error(
      (error as Error).message || "LLM 요청에 실패했습니다."
    );
  }
};

export const postTranslation = async (documentId: string, accessToken?: string) => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `https://be-paper-dot.store/api/v1/documents/${documentId}/process?overwrite=false`,
      {
        method: "POST",
        headers,
        credentials: "include",
      }
    );

    // HTML 응답 감지 (인증 실패 시 로그인 페이지 반환)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new Error("인증이 필요합니다. 로그인해주세요.");
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("인증이 필요합니다. 로그인해주세요.");
      }
      throw new Error("번역 요청에 실패했습니다!");
    }

    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "번역 요청에 실패했습니다!"
    );
  }
};

// 문서 상세 정보 가져오기
export interface DocumentDetail {
  documentId: number;
  fileId: number;
  title: string;
  originalFilename: string;
  storagePath: string;
  fileType: string;
  status: string;
  mimeType: string;
  fileSizeBytes: number;
  languageSrc: string;
  languageTgt: string;
  createdAt: string;
  updatedAt: string;
}

export const getDocumentDetail = async (
  documentId: string | number,
  accessToken?: string
): Promise<DocumentDetail> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://be-paper-dot.store";
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${apiUrl}/api/v1/papers/${documentId}`, {
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
      throw new Error("문서 정보를 가져오는데 실패했습니다!");
    }

    const data: DocumentDetail = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "문서 정보를 가져오는데 실패했습니다!"
    );
  }
};
