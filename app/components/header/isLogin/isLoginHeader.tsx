"use client";

import React, { useEffect, useState } from "react";

export default function IsLoginHeaderComponent() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await fetch("/api/users", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setIsLogin(data);
    };
    fetchUserInfo();
  }, []);

  console.log(isLogin);

  return <div>isLoginHeader</div>;
}
