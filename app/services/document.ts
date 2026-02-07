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

export const requestLLM = async (file: File) => {
  const response = await fetch("https://be-paper-dot.store/api/llm/chat-pdf", {
    method: "POST",
    body: file,
  });

  const text = await response.text();
  console.log("text", text);

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
};

export const postTranslation = async (documentId: string) => {
  const response = await fetch(
    `https://be-paper-dot.store/api/v1/documents/${documentId}/process`,
    {
      method: "POST",
      body: documentId,
    }
  );

  const data = await response.json();
  return data;
};
