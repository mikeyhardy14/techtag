"use client";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No auth checks here, just render children
  return <>{children}</>;
} 