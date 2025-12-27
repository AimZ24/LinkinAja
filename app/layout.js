import "./globals.css";

export const metadata = {
  title: "LinkinAja - Satu Link Untuk Semuanya",
  description: "Satu link simpel untuk semua kebutuhanmu. Cocok untuk jualan di Instagram, profil TikTok, portofolio kreator, atau kontak bisnis UMKM kamu.",
};

import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased selection:bg-primary selection:text-text-main transition-colors duration-200">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
