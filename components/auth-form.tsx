"use client";

import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { firebaseApp, requireFirebaseConfig } from "@/lib/firebase";

type AuthMode = "sign-in" | "sign-up";

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "That email or password is not correct.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/user-not-found": "That email or password is not correct.",
  "auth/wrong-password": "That email or password is not correct.",
  "auth/email-already-in-use": "An account already exists with this email.",
  "auth/weak-password": "Use a password with at least six characters.",
  "auth/popup-closed-by-user": "The Google sign-in window was closed before it finished.",
  "auth/popup-blocked": "Your browser blocked the Google sign-in window. Allow popups and try again.",
  "auth/account-exists-with-different-credential":
    "An account already exists with this email using a different sign-in method.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/network-request-failed": "A network error interrupted the request. Check your connection.",
};

function friendlyAuthError(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: string }).code;
    if (code && AUTH_ERRORS[code]) return AUTH_ERRORS[code];
  }
  return "Something went wrong. Check your details and try again.";
}

function GoogleMark(): React.ReactElement {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.796 2.715v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.614Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.181l-2.908-2.258c-.806.54-1.835.86-3.048.86-2.344 0-4.33-1.584-5.04-3.713H.954v2.331A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.96 10.708A5.41 5.41 0 0 1 3.677 9c0-.593.102-1.17.283-1.708V4.961H.954A9 9 0 0 0 0 9c0 1.453.348 2.828.954 4.039l3.006-2.331Z" />
      <path fill="#EA4335" d="M9 3.58c1.323 0 2.51.455 3.445 1.348l2.586-2.586C13.463.89 11.425 0 9 0A9 9 0 0 0 .954 4.961L3.96 7.292C4.67 5.163 6.656 3.58 9 3.58Z" />
    </svg>
  );
}

export function AuthForm(): React.ReactElement {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const authenticateWithGoogle = async () => {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      requireFirebaseConfig();
      await signInWithPopup(getAuth(firebaseApp), new GoogleAuthProvider());
      router.replace("/editor");
    } catch (authError) {
      setError(friendlyAuthError(authError));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      requireFirebaseConfig();
      const auth = getAuth(firebaseApp);
      if (mode === "sign-in") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace("/editor");
    } catch (authError) {
      setError(friendlyAuthError(authError));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Enter your email address first, then choose forgot password.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      requireFirebaseConfig();
      await sendPasswordResetEmail(getAuth(firebaseApp), email);
      setSuccess("Password reset instructions are on their way. Check your inbox.");
    } catch (authError) {
      setError(friendlyAuthError(authError));
    } finally {
      setBusy(false);
    }
  };

  const isSignIn = mode === "sign-in";

  return (
    <div className="aph-panel relative w-full max-w-md overflow-hidden p-6 shadow-[0_20px_60px_-36px_rgba(0,0,0,0.9)] sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="aph-eyebrow">{isSignIn ? "Workspace access" : "Create workspace access"}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {isSignIn ? "Welcome back" : "Start with Aphelion"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#8a8a94]">
            {isSignIn ? "Sign in to continue to your editor workspace." : "Save your projects and pick up where you left off."}
          </p>
        </div>
        <span className="aph-chip aph-chip--accent mt-1">{isSignIn ? "01" : "02"}</span>
      </div>

      <div className="mb-6 grid grid-cols-2 border border-[#33333a] bg-[#141416] p-1" role="tablist" aria-label="Authentication mode">
        <button type="button" role="tab" aria-selected={isSignIn} onClick={() => switchMode("sign-in")} className={`px-3 py-2 text-xs font-semibold transition-colors ${isSignIn ? "bg-[#2a2a32] text-white shadow-sm" : "text-[#8a8a94] hover:text-white"}`}>
          Sign in
        </button>
        <button type="button" role="tab" aria-selected={!isSignIn} onClick={() => switchMode("sign-up")} className={`px-3 py-2 text-xs font-semibold transition-colors ${!isSignIn ? "bg-[#2a2a32] text-white shadow-sm" : "text-[#8a8a94] hover:text-white"}`}>
          Sign up
        </button>
      </div>

      {error && <p className="mb-4 border border-[#713b3b] bg-[#321f1f] px-3 py-2.5 text-sm leading-5 text-[#ffb4b4]" role="alert">{error}</p>}
      {success && <p className="mb-4 border border-[#3d6b45] bg-[#243528] px-3 py-2.5 text-sm leading-5 text-[#b9e3bf]" role="status">{success}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#c8c8c8]" htmlFor="auth-email">Email address</label>
          <input className="aph-field block min-h-10 w-full text-sm outline-none transition-colors placeholder:text-[#686872] focus:border-[#6ba9d9]" id="auth-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label className="block text-xs font-semibold text-[#c8c8c8]" htmlFor="auth-password">Password</label>
            {isSignIn && <button type="button" onClick={handleReset} disabled={busy} className="aph-link text-xs disabled:cursor-not-allowed disabled:opacity-50">Forgot password?</button>}
          </div>
          <input className="aph-field block min-h-10 w-full text-sm outline-none transition-colors placeholder:text-[#686872] focus:border-[#6ba9d9]" id="auth-password" name="password" type="password" autoComplete={isSignIn ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />
        </div>
        {!isSignIn && <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#c8c8c8]" htmlFor="auth-confirm-password">Confirm password</label>
          <input className="aph-field block min-h-10 w-full text-sm outline-none transition-colors placeholder:text-[#686872] focus:border-[#6ba9d9]" id="auth-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" />
        </div>}
        <button type="submit" disabled={busy} className="aph-btn aph-btn--primary aph-btn--lg w-full">
          {busy ? "Working..." : isSignIn ? "Sign in to Aphelion" : "Create account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#686872]" aria-hidden="true"><span className="h-px flex-1 bg-[#33333a]" />or continue with<span className="h-px flex-1 bg-[#33333a]" /></div>
      <button type="button" disabled={busy} onClick={authenticateWithGoogle} className="aph-btn aph-btn--secondary w-full"><GoogleMark />Google {isSignIn ? "sign in" : "sign up"}</button>
      <p className="mt-6 text-center text-xs leading-5 text-[#686872]">By continuing, you agree to use Aphelion responsibly.</p>
    </div>
  );
}
