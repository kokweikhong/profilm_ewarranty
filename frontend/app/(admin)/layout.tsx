import type { Metadata } from "next";
import AdminLayout from "./_components/AdminLayout";

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
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
