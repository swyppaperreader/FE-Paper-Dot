import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const response = await fetch("https://be-paper-dot.store/documents", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    // Content-Type이 JSON인지 확인
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || "서버 오류가 발생했습니다." },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } else {
      // HTML이나 다른 형식이 반환된 경우
      const text = await response.text();
      console.error("백엔드 응답 (JSON 아님):", text.substring(0, 200));

      return NextResponse.json(
        { error: "서버가 예상치 못한 형식으로 응답했습니다." },
        { status: response.status || 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
