import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const getToken = async (req?: Request) => {
  try {
    const headersList = await headers();

    // 1. Referer 헤더에서 URL 파싱 (OAuth 리다이렉트 URL)
    const referer = headersList.get("referer") || headersList.get("Referer");
    if (referer && referer.includes("kakao")) {
      try {
        const url = new URL(referer);
        const code = url.searchParams.get("code");
        if (code) {
          return code;
        }
      } catch (e) {
        // URL 파싱 실패 시 무시
      }
    }

    // 2. 요청 URL에서 직접 추출 (req가 제공된 경우)
    if (req) {
      try {
        const url = new URL(req.url);
        const code = url.searchParams.get("code");
        if (code && url.pathname.includes("kakao")) {
          return code;
        }
      } catch (e) {
        // URL 파싱 실패 시 무시
      }
    }

    // 3. Authorization 헤더 확인
    const authHeader =
      headersList.get("authorization") || headersList.get("Authorization");
    if (authHeader) {
      return authHeader.replace(/^Bearer\s+/i, "");
    }

    return null;
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

export async function GET() {
  try {
    const response = await fetch("https://be-paper-dot.store/users/me");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "사용자 정보 조회에 실패했습니다!" },
      { status: 500 }
    );
  }
}
