"use client";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No auth checks here, just render children
  return <>{children}</>;
} 