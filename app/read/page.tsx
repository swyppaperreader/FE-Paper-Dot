import { Suspense } from "react";
import Read from "@/app/components/Read";

function ReadPageContent() {
  return <Read />;
}

export default function ReadPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>로딩 중...</div>}>
      <ReadPageContent />
    </Suspense>
  );
}
