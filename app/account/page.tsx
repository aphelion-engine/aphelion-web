import type { Metadata } from "next";

import { AccountSettings } from "@/components/account-settings";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Account settings",
  "Manage your Aphelion workspace account and session.",
);

export default function AccountPage(): React.ReactElement {
  return (
    <div className="aph-graph min-h-[calc(100vh-9rem)] border-b border-[#121212]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="aph-eyebrow"><span className="size-1.5 rounded-full bg-[#50a0ff] shadow-[0_0_12px_#50a0ff]" />Aphelion workspace</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Account settings</h1>
          <p className="mt-4 text-base leading-7 text-[#a3a3ad]">Review the identity and sign-in method attached to your creative workspace.</p>
        </div>
        <div className="mt-10">
          <AccountSettings />
        </div>
      </div>
    </div>
  );
}
