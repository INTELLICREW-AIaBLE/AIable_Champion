import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex px-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">AIable</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end px-4">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <nav className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">
              U
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}