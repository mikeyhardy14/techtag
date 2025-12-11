// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ConditionalNavbar from "@/components/ConditionalNavbar/ConditionalNavbar";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TechTag",
  description: "Decode HVAC model nomenclatures",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  shrinkToFit: "no",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ConditionalNavbar />
          <main>{children}</main>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
