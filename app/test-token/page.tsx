"use client";

import { useEffect, useState } from "react";

interface ApiResponse {
  error?: string;
  [key: string]: unknown;
}

export default function TestTokenPage() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const testGetToken = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setResult(data);
      console.log("API 응답:", data);
    } catch (error) {
      console.error("에러:", error);
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 페이지 로드 시 자동으로 테스트 실행
    testGetToken();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>토큰 테스트 페이지</h1>
      <p>이 페이지는 `/api/users`를 호출하여 getToken 함수를 테스트합니다.</p>
      <p>서버 콘솔(터미널)을 확인하세요!</p>

      <button
        onClick={testGetToken}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}>
        {loading ? "테스트 중..." : "다시 테스트"}
      </button>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}>
        <h2>API 응답 결과:</h2>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#e8f4f8",
          borderRadius: "8px",
        }}>
        <h3>테스트 방법:</h3>
        <ol>
          <li>
            브라우저에서 이 페이지를 열기: <code>/test-token</code>
          </li>
          <li>서버 터미널에서 로그 확인</li>
          <li>
            OAuth 리다이렉트 후 이 페이지로 돌아오면 Referer 헤더에 URL이 포함됨
          </li>
        </ol>
      </div>
    </div>
  );
}
