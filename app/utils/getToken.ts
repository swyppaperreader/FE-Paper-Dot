import { headers } from "next/headers";

export const getToken = async (req?: Request) => {
  try {
    const headersList = await headers();

    console.log("=== getToken 함수 실행 ===");
    console.log("요청 URL:", req?.url);

    // 1. Referer 헤더에서 URL 파싱 (OAuth 리다이렉트 URL)
    const referer = headersList.get("referer") || headersList.get("Referer");
    console.log("Referer 헤더:", referer);

    if (referer && referer.includes("kakao")) {
      try {
        const url = new URL(referer);
        const code = url.searchParams.get("code");
        console.log("Referer에서 추출한 code:", code);
        if (code) {
          console.log(
            "✅ Referer에서 code 추출 성공:",
            code.substring(0, 30) + "..."
          );
          return code;
        }
      } catch (e) {
        console.log("❌ Referer URL 파싱 실패:", e);
      }
    }

    // 2. 요청 URL에서 직접 추출 (req가 제공된 경우)
    if (req) {
      try {
        const url = new URL(req.url);
        const code = url.searchParams.get("code");
        console.log("요청 URL에서 추출한 code:", code);
        console.log("요청 URL pathname:", url.pathname);
        if (code && url.pathname.includes("kakao")) {
          console.log(
            "✅ 요청 URL에서 code 추출 성공:",
            code.substring(0, 30) + "..."
          );
          return code;
        }
      } catch (e) {
        console.log("❌ 요청 URL 파싱 실패:", e);
      }
    }

    // 3. Authorization 헤더 확인
    const authHeader =
      headersList.get("authorization") || headersList.get("Authorization");
    console.log("Authorization 헤더:", authHeader ? "존재함" : "없음");
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, "");
      console.log(
        "✅ Authorization 헤더에서 토큰 추출:",
        token.substring(0, 20) + "..."
      );
      return token;
    }

    console.log("❌ 토큰을 찾을 수 없음");
    return null;
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};
