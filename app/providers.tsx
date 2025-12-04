// app/providers.tsx
"use client";

import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { ProfileProvider } from "@/components/ProfileProvider/ProfileProvider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        {children}
      </ProfileProvider>
    </AuthProvider>
  );
}
