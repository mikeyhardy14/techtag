// app/providers.tsx
"use client";

import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { ProfileProvider } from "@/components/ProfileProvider/ProfileProvider";
import { ProjectsProvider } from "@/components/ProjectsProvider/ProjectsProvider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ProjectsProvider>
          {children}
        </ProjectsProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
