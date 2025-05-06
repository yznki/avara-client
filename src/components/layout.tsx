import React from 'react';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default Layout;
