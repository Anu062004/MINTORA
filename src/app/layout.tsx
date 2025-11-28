"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative" style={{ color: '#f1f5f9', backgroundColor: '#030712' }}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Navigation />
            <main className="relative z-10" style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>{children}</main>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}


