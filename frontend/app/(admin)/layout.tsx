import type { Metadata } from "next";
import AdminLayout from "./_components/AdminLayout";
import { ToastProvider } from "@/contexts/ToastContext";

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
    <ToastProvider>
      <AdminLayout>{children}</AdminLayout>
    </ToastProvider>
  );
}
