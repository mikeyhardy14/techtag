// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
