import { AppNavbar } from "@/components/layout/AppNavbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative flex min-h-screen flex-col pb-16 md:pb-0">
        <AppNavbar />
        <div className="flex-1 items-start flex">
          <Sidebar />
          <main className="relative py-6 lg:gap-10 lg:py-8 flex-1 w-full max-w-full overflow-x-hidden flex flex-col justify-between min-h-[calc(100vh-3.5rem)]">
            <div className="mx-auto w-full min-w-0 px-4 md:px-8 flex-1 pb-12">
              {children}
            </div>
            <Footer />
          </main>
        </div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
