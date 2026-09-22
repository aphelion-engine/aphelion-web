import type { Metadata } from "next";
import NextLink from "next/link";

import { AuthForm } from "@/components/auth-form";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Sign in to Aphelion",
  "Sign in or create an Aphelion workspace account.",
);

export default function LoginPage(): React.ReactElement {
  return (
    <div className="aph-graph min-h-[calc(100vh-9rem)] border-b border-[#121212]">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-20 lg:py-24">
        <section className="max-w-xl">
          <p className="aph-eyebrow"><span className="size-1.5 rounded-full bg-[#50a0ff] shadow-[0_0_12px_#50a0ff]" />Aphelion workspace</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl">Your next cut starts in the graph.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#a3a3ad]">Sign in to keep your node graphs, compositions, and creative momentum in one place.</p>
          <div className="mt-10 hidden max-w-md border-l border-[#3b6384] pl-4 sm:block">
            <p className="font-mono text-xs leading-6 text-[#8a8a94]">{"// workspace state"}</p>
            <p className="font-mono text-sm leading-6 text-[#9ecfff]">ready_to_compose: true</p>
            <p className="mt-1 font-mono text-xs leading-6 text-[#686872]">nodes &middot; timeline &middot; viewer</p>
          </div>
          <NextLink href="/" className="aph-link mt-10 inline-flex text-sm">Back to aphelion-community.com <span aria-hidden="true" className="ml-2">-&gt;</span></NextLink>
        </section>
        <AuthForm />
      </div>
    </div>
  );
}
