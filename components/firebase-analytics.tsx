"use client";

import { getAnalytics, isSupported } from "firebase/analytics";
import { useEffect } from "react";

import { firebaseApp } from "@/lib/firebase";

export function FirebaseAnalytics(): null {
  useEffect(() => {
    let cancelled = false;

    void isSupported().then((supported) => {
      if (supported && !cancelled) {
        getAnalytics(firebaseApp);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
