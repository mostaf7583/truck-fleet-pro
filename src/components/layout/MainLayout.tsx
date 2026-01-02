import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar & Header */}
      <div className="fixed top-0 right-0 z-30 flex w-full items-center border-b bg-background px-4 py-3 md:hidden">
        <MobileSidebar />
        <h1 className="mr-3 font-display text-lg font-bold">فليت برو</h1>
      </div>

      {/* Main Content */}
      <main className="transition-all duration-300 md:pr-64 pt-16 md:pt-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
