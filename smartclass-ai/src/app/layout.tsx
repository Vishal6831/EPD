import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SimulationProvider } from "@/contexts/SimulationContext";
import { LayoutWrapper } from "./layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartClass AI Dashboard",
  description: "AI-Powered Smart Classroom Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-50 min-h-screen flex`}>
        <SimulationProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SimulationProvider>
      </body>
    </html>
  );
}
