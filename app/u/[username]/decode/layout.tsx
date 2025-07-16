"use client";

export default function DecodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No auth checks here, just render children
  return <>{children}</>;
} 