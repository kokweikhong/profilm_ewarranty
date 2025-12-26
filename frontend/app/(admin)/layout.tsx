import type { Metadata } from "next";
import AdminLayout from "./_components/AdminLayout";
import RoleGuard from "@/components/RoleGuard";

export const metadata: Metadata = {
  title: "ProFilm eWarranty Admin",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
