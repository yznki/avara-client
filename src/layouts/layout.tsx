import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getCookie } from '@/lib/cookies';
import { AppSidebar } from '@/components/Sidebar/Sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const pageTitles: Record<string, string> = {
  '': 'Dashboard',
  accounts: 'Accounts',
  transactions: 'Transactions',
};

function Layout() {
  const sidebarCookie = getCookie('sidebar_state');
  const defaultOpen = sidebarCookie !== 'false';

  const location = useLocation();
  const segment = location.pathname.split('/').filter(Boolean).pop() ?? '';
  const pageTitle = pageTitles[segment] || 'Page';

  useEffect(() => {
    document.title = `Avara | ${pageTitle}`;
  }, [pageTitle]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="p-4 w-full">
        <header className="flex h-6 items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <p className="text-lg animate-fade-in">{pageTitle}</p>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Layout;
