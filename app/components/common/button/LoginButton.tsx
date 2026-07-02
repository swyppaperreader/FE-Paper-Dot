"use client";

import { LOGIN_BUTTON_TEXT } from "@/app/constants/loginButton";
import { login } from "@/app/lib/login";
import Image from "next/image";

export default function LoginButton() {
  return (
    <>
      {LOGIN_BUTTON_TEXT.map(({ provider, icon, text, className }) => (
        <button
          onClick={() => login({ provider: provider })}
          className={className}
          key={provider}>
          <Image src={icon} alt={provider} width={20} height={20} />
          {text}
        </button>
      ))}
    </>
  );
}
