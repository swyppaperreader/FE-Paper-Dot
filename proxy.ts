import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/lib/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = ["/mypage", "/newdocument", "/read"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/mypage/:path*", "/newdocument", "/read/:path*"],
};
