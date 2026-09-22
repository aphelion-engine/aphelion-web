import type { Metadata } from "next";
import { Suspense } from "react";

import { LicensePurchase } from "@/components/license-purchase";
import { licensePricing } from "@/lib/server/paypal";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Lifetime license", "Own every current and future Aphelion product with one lifetime license.");

export default function LicensePage(): React.ReactElement {
  let pricing: { price: string; currency: string } | null = null;
  try { pricing = licensePricing(); } catch { /* The UI remains safe and explains that checkout is unavailable until configured. */ }
  return <div className="aph-graph min-h-[calc(100vh-9rem)] border-b border-[#121212]"><div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20"><div className="mb-10 max-w-2xl"><p className="aph-eyebrow"><span className="size-1.5 rounded-full bg-[#50a0ff] shadow-[0_0_12px_#50a0ff]" />Aphelion licensing</p><h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">A permanent place in the graph.</h1><p className="mt-4 text-base leading-7 text-[#a3a3ad]">Secure lifetime ownership for the tools you use to make, compose, and ship.</p></div><Suspense fallback={<div className="aph-panel p-6 text-sm text-[#8a8a94]">Preparing secure checkout...</div>}><LicensePurchase price={pricing?.price ?? null} currency={pricing?.currency ?? "USD"} /></Suspense></div></div>;
}
