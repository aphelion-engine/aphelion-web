import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Server configuration is missing ${name}.`);
  return value;
}

function privateKey(): string {
  const value = required("FIREBASE_ADMIN_PRIVATE_KEY")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");

  if (!value.includes("-----BEGIN PRIVATE KEY-----") || !value.includes("-----END PRIVATE KEY-----")) {
    throw new Error("FIREBASE_ADMIN_PRIVATE_KEY must be a valid PEM private key.");
  }

  return value;
}

export function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  return initializeApp({
    credential: cert({
      projectId: required("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: required("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey: privateKey(),
    }),
  });
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

export function adminDb() {
  return getFirestore(getAdminApp());
}

export async function verifyFirebaseBearer(authorization: string | null) {
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Authentication is required.");
  }
  const token = authorization.slice(7).trim();
  if (!token || token.length > 8192) throw new Error("Authentication is required.");
  return adminAuth().verifyIdToken(token);
}
