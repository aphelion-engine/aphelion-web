"use client";

import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { firebaseApp, requireFirebaseConfig } from "@/lib/firebase";

type Props = { price: string | null; currency: string };

async function apiRequest(user: User, url: string, init: RequestInit = {}) {
  const token = await user.getIdToken();
  return fetch(url, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init.headers } });
}

export function LicensePurchase({ price, currency }: Props): React.ReactElement {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [resolved, setResolved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [copied, setCopied] = useState(false);
  const captureStarted = useRef(false);

  useEffect(() => { try { requireFirebaseConfig(); return onAuthStateChanged(getAuth(firebaseApp), (next) => { setUser(next); setResolved(true); }); } catch { queueMicrotask(() => setResolved(true)); return undefined; } }, []);

  useEffect(() => {
    const orderId = searchParams.get("token");
    if (!user || !orderId || searchParams.get("payment") !== "approved" || licenseKey || captureStarted.current) return;
    captureStarted.current = true;
    void Promise.resolve().then(() => {
      setBusy(true);
      return apiRequest(user, "/api/payments/paypal/capture-order", { method: "POST", body: JSON.stringify({ orderId }) });
    }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Payment confirmation failed."); setLicenseKey(body.licenseKey || ""); if (!body.licenseKey) setError("Payment is complete. Your license is already secured in your account."); })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Payment confirmation failed."))
      .finally(() => setBusy(false));
  }, [licenseKey, searchParams, user]);

  const startPurchase = async () => {
    if (!user) return;
    setBusy(true); setError("");
    try {
      const response = await apiRequest(user, "/api/payments/paypal/create-order", { method: "POST", body: "{}" });
      const body = await response.json();
      if (!response.ok || !body.approvalUrl) throw new Error(body.error || "Unable to start checkout.");
      window.location.assign(body.approvalUrl);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to start checkout."); setBusy(false); }
  };

  const copyKey = async () => { await navigator.clipboard.writeText(licenseKey); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="aph-panel overflow-hidden">
        <div className="border-b border-[#33333a] bg-[#232323] px-6 py-6 sm:px-8">
          <p className="aph-eyebrow">One license. Every Aphelion product.</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Own the whole graph.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#a3a3ad]">A single lifetime license covers Aphelion Editor today and future Aphelion products as they ship. The editor has a seven-day trial reminder, but it does not lock you out or disable your work after the reminder appears.</p>
        </div>
        <div className="grid gap-px bg-[#33333a] sm:grid-cols-3">
          {["Lifetime ownership", "All future products", "One-time payment"].map((item, index) => <div className="bg-[#252525] px-5 py-5" key={item}><span className="font-mono text-xs text-[#50a0ff]">0{index + 1}</span><p className="mt-2 text-sm font-semibold text-[#e6e6e6]">{item}</p></div>)}
        </div>
      </div>
      <aside className="aph-panel h-fit p-6 sm:p-7">
        <p className="aph-eyebrow">Lifetime license</p>
        <div className="mt-3 flex items-end gap-2"><span className="text-4xl font-semibold tracking-[-0.04em] text-white">{price ? `${currency} ${price}` : "Unavailable"}</span><span className="mb-1 text-xs text-[#8a8a94]">once</span></div>
        {!resolved ? <p className="mt-5 text-sm text-[#8a8a94]" role="status">Checking your account...</p> : !user ? <><p className="mt-4 text-sm leading-6 text-[#8a8a94]">Sign in before checkout so your purchase and license are bound to your account.</p><NextLink className="aph-btn aph-btn--primary mt-5 w-full" href="/login">Sign in to purchase</NextLink></> : <button className="aph-btn aph-btn--primary mt-5 w-full" disabled={busy || !price} onClick={startPurchase}>{busy ? "Opening secure checkout..." : "Purchase lifetime license"}</button>}
        {error && <p className="mt-4 border border-[#713b3b] bg-[#321f1f] px-3 py-2.5 text-sm leading-5 text-[#ffb4b4]" role="alert">{error}</p>}
        <p className="mt-5 text-xs leading-5 text-[#686872]">Checkout is completed on PayPal. Aphelion verifies the captured amount on the server before issuing anything.</p>
      </aside>
      {licenseKey && <div className="aph-panel border-[#3d6b45] p-6 lg:col-span-2" role="status"><p className="aph-eyebrow text-[#a8d8b0]">Payment confirmed</p><h2 className="mt-2 text-lg font-semibold text-white">Your license key</h2><p className="mt-2 text-sm leading-6 text-[#a3a3ad]">Copy this key now. For your protection, it will not be shown again after you leave this page.</p><code className="aph-terminal__code aph-terminal__code--wrap mt-5 block border border-[#3d6b45] text-[#b9e3bf]">{licenseKey}</code><button className="aph-btn aph-btn--secondary mt-4" onClick={copyKey}>{copied ? "Copied" : "Copy license key"}</button></div>}
    </section>
  );
}
