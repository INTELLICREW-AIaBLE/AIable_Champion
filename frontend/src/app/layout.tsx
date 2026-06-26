import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AIable",
  description: "AIable App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={`antialiased`}>
        <TooltipProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1 items-start flex">
              <Sidebar />
              <main className="relative py-6 lg:gap-10 lg:py-8 flex-1">
                <div className="mx-auto w-full min-w-0 px-4 md:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}