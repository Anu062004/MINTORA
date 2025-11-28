import "./globals.css";
import Navigation from "@/components/Navigation";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative"
        style={{ color: "#f1f5f9", backgroundColor: "#030712" }}
      >
        <Providers>
          <Navigation />
          <main
            className="relative z-10"
            style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}


