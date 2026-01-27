import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
    redirectUri || process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
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

  return NextResponse.json(tokenData);
}
