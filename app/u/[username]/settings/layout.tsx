"use client";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No auth checks here, just render children
  return <>{children}</>;
} 