import type { Metadata } from "next";

import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Panel de operaciones",
  description: "Demo del espacio operativo de Equiply.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
