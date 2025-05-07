import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/Sidebar/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default Layout;
