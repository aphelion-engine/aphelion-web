"use client";

import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { firebaseApp, requireFirebaseConfig } from "@/lib/firebase";

type License = { id: string; keyPrefix?: string; keyLastFour?: string; purchasedAt?: string | null; redeemedProducts: string[] };

function formatDate(date: string | undefined): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

function providerName(user: User): string {
  const providerId = user.providerData[0]?.providerId;
  if (providerId === "google.com") return "Google";
  if (providerId === "password") return "Email and password";
  return providerId ?? "Aphelion account";
}

export function AccountSettings(): React.ReactElement {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [resolved, setResolved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [licensesLoading, setLicensesLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void = () => undefined;
    try { requireFirebaseConfig(); unsubscribe = onAuthStateChanged(getAuth(firebaseApp), (nextUser) => {
      setUser(nextUser);
      setResolved(true);
    }); } catch { queueMicrotask(() => { setResolved(true); setError("Firebase is not configured on this deployment."); }); }
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (resolved && !user) router.replace("/login");
  }, [resolved, router, user]);

  useEffect(() => {
    if (!user) return;
    void user.getIdToken().then((token) => fetch("/api/licenses", { headers: { Authorization: `Bearer ${token}` } }))
      .then(async (response) => { if (!response.ok) throw new Error("License list unavailable"); const body = await response.json() as { licenses: License[] }; setLicenses(body.licenses); })
      .catch(() => setError("We couldn't load your licenses right now."))
      .finally(() => setLicensesLoading(false));
  }, [user]);

  const handleSignOut = async () => {
    setBusy(true);
    setError("");
    try {
      await signOut(getAuth(firebaseApp));
      router.replace("/");
    } catch {
      setError("We couldn't sign you out. Check your connection and try again.");
      setBusy(false);
    }
  };

  if (!resolved) {
    return (
      <div className="aph-panel p-6" role="status" aria-live="polite">
        <p className="aph-eyebrow">Account settings</p>
        <p className="mt-3 text-sm text-[#8a8a94]">Checking your workspace session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="aph-panel p-6" role="status" aria-live="polite">
        <p className="text-sm text-[#8a8a94]">Redirecting you to sign in...</p>
      </div>
    );
  }

  const created = formatDate(user.metadata.creationTime);
  const lastSignIn = formatDate(user.metadata.lastSignInTime);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="aph-panel overflow-hidden">
        <div className="border-b border-[#33333a] bg-[#232323] px-5 py-4 sm:px-6">
          <p className="aph-eyebrow">Workspace identity</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Your account</h2>
          <p className="mt-1 text-sm leading-6 text-[#8a8a94]">The details connected to your Aphelion workspace.</p>
        </div>
        <dl className="divide-y divide-[#33333a]">
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#686872]">Email</dt>
            <dd className="break-anywhere text-sm text-[#e6e6e6]">{user.email ?? "Not provided"}</dd>
          </div>
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#686872]">Display name</dt>
            <dd className="text-sm text-[#e6e6e6]">{user.displayName ?? "Not set"}</dd>
          </div>
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#686872]">Signed in with</dt>
            <dd className="text-sm text-[#e6e6e6]">{providerName(user)}</dd>
          </div>
          {created && <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-6"><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#686872]">Account created</dt><dd className="text-sm text-[#e6e6e6]">{created}</dd></div>}
          {lastSignIn && <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-6"><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#686872]">Last sign in</dt><dd className="text-sm text-[#e6e6e6]">{lastSignIn}</dd></div>}
        </dl>
      </section>

      <section className="aph-panel overflow-hidden lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#33333a] bg-[#232323] px-5 py-4 sm:px-6">
          <div><p className="aph-eyebrow">Product access</p><h2 className="mt-2 text-lg font-semibold text-white">Your licenses</h2><p className="mt-1 text-sm leading-6 text-[#8a8a94]">Keys are never shown here. Redeem a product once per license.</p></div>
          <a href="/license" className="aph-btn aph-btn--secondary">Get a lifetime license</a>
        </div>
        {licensesLoading ? <p className="px-5 py-5 text-sm text-[#8a8a94]" role="status">Loading license records...</p> : licenses.length === 0 ? <p className="px-5 py-5 text-sm text-[#8a8a94]">No lifetime licenses are attached to this account yet.</p> : <div className="divide-y divide-[#33333a]">{licenses.map((license) => <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6" key={license.id}><div><p className="font-mono text-sm text-[#e6e6e6]">{license.keyPrefix}••••{license.keyLastFour}</p><p className="mt-1 text-xs text-[#686872]">Purchased {license.purchasedAt ? formatDate(license.purchasedAt) : "date unavailable"}</p></div><div className="flex flex-wrap gap-2">{license.redeemedProducts.includes("aphelion-editor") ? <span className="aph-chip aph-chip--success">Editor redeemed</span> : <span className="aph-chip aph-chip--warn">Editor not redeemed</span>}</div></div>)}</div>}
      </section>

      <aside className="aph-panel h-fit p-5 sm:p-6">
        <p className="aph-eyebrow">Session</p>
        <h2 className="mt-2 text-base font-semibold text-white">Workspace access</h2>
        <p className="mt-2 text-sm leading-6 text-[#8a8a94]">Sign out here when you are finished on a shared or public device.</p>
        {error && <p className="mt-4 border border-[#713b3b] bg-[#321f1f] px-3 py-2.5 text-sm leading-5 text-[#ffb4b4]" role="alert">{error}</p>}
        <button type="button" className="aph-btn aph-btn--secondary mt-5 w-full" onClick={handleSignOut} disabled={busy}>
          {busy ? "Signing out..." : "Log out"}
        </button>
      </aside>
    </div>
  );
}
