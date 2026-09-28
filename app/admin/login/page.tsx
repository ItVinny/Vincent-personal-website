import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

// useSearchParams() (used inside LoginForm, to read a ?from= redirect
// target) requires a Suspense boundary in Next.js 15's App Router,
// or the build fails while prerendering this page. This wrapper is
// the fix -- LoginForm itself is unchanged in behavior.
export const dynamic = "force-dynamic";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
