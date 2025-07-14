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
  viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
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
