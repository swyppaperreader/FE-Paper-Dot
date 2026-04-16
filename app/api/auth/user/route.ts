import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { user: null, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
