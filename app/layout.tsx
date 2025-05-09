// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TechTag",
  description: "Decode HVAC model nomenclatures",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
