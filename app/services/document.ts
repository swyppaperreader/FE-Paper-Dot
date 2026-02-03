export const postDocuments = async (formData: FormData) => {
  try {
    const response = await fetch("https://be-paper-dot.store/api/documents", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("파일 업로드에 실패했습니다!");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "파일 업로드에 실패했습니다!");
  }
};
