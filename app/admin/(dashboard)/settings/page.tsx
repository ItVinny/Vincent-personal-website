import { auth } from "@/lib/auth";
import { PasswordForm } from "./PasswordForm";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Settings
      </h1>
      <p className="mb-8 text-[15px] text-[#6e6e73]">
        Account details for this admin panel.
      </p>

      <div className="mb-8 max-w-md rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h2 className="mb-1 text-[13px] font-medium text-[#1d1d1f]">
          Signed in as
        </h2>
        <p className="text-[15px] text-[#6e6e73]">{session?.user?.email}</p>
        <p className="mt-3 text-[12px] text-[#86868b]">
          This admin system supports a single account, set up via the seed
          script. There's no sign-up flow by design.
        </p>
      </div>

      <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[#86868b]">
        Change password
      </h2>
      <PasswordForm />
    </div>
  );
}
