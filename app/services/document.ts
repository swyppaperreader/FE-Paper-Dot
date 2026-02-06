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
