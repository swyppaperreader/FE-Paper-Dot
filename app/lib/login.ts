import { createClient } from "./client";

export const login = async ({ provider }: { provider: "kakao" | "google" }) => {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback`;

  supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });
};
