"use client";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <main className="flex-1 bg-slate-950 overflow-y-auto">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900">
          {children}
        </main>
      </div>
    </>
  );
}
