import { Suspense } from "react";
import ReadList from "@/app/components/read/readList/ReadList";

export const dynamic = "force-dynamic";

function ReadPageContent() {
  return <ReadList />;
}

export default function ReadPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>로딩 중...</div>}>
      <ReadPageContent />
    </Suspense>
  );
}
