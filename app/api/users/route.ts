import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://be-paper-dot.store/users/me");
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "사용자 정보 조회에 실패했습니다!" },
      { status: 500 }
    );
  }
}
