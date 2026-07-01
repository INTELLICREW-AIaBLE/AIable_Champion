import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GatewayGuard } from "@/components/layout/GatewayGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AIaBLE — The Next-Gen Academic AI Workspace",
  description: "Optimize prompts, match assignments, explore AI recipes and validate outputs with AIaBLE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('app_theme') === 'dark') {
                  document.documentElement.classList.add('dark-mode-active');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '123456789-dummy.apps.googleusercontent.com'}>
          <TooltipProvider>
            <GatewayGuard>
              {children}
            </GatewayGuard>
          </TooltipProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

