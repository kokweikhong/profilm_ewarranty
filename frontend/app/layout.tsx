import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import CookiePopup from "@/components/CookiePopup";

export const metadata: Metadata = {
  title: "Profilm eWarranty",
  description: "eWarranty management system for Profilm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white`}>
        <ToastProvider>
          <AuthProvider>
            {children}
            <CookiePopup />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
