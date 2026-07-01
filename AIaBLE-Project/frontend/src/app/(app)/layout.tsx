import { AppNavbar } from "@/components/layout/AppNavbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col pb-16 md:pb-0">
      <AppNavbar />
      <div className="flex-1 items-start flex">
        <Sidebar />
        <main className="relative py-6 lg:gap-10 lg:py-8 flex-1 w-full max-w-full overflow-x-hidden">
          <div className="mx-auto w-full min-w-0 px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
