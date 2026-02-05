import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const redirectUri = searchParams.get("redirect_uri");

    if (!code) {
      return NextResponse.json({ error: "No code" }, { status: 400 });
    }

    const client_id = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;

    // 클라이언트에서 전달받은 redirect_uri 사용, 없으면 기본값
    const redirect_uri =
      redirectUri || process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_DEV;

    const tokenRes = await fetch(`https://kauth.kakao.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: client_id!,
        client_secret: client_secret || "",
        redirect_uri: redirect_uri!,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json(tokenData, { status: 400 });
    }

    // 메인 페이지로 리다이렉트 (쿠키를 포함하여)
    const redirectResponse = NextResponse.redirect(new URL("/", req.url));

    // refresh_token만 쿠키에 저장
    if (tokenData.refresh_token) {
      redirectResponse.cookies.set(
        "oauth_refresh_token",
        tokenData.refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30일
          path: "/",
        }
      );
      console.log("✅ refresh_token 쿠키 저장 완료");
    }

    return redirectResponse;
  } catch (error) {
    console.error("카카오 토큰 요청 에러:", error);
    return NextResponse.json(
      { error: "토큰 요청에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    await fetch("https://be-paper-dot.store/oauth2/authorization/kakao", {
      method: "POST",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      credentials: "include",
    });
  } catch {
    return NextResponse.json(
      { error: "토큰 요청에 실패했습니다." },
      { status: 500 }
    );
  }
}
