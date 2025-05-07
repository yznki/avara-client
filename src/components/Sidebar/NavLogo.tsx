'use client';

import { Link } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavLogo() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Link to="/">
            <div className="flex w-8 h-8 items-center justify-center rounded-lg shrink-0">
              <img
                src="/symbol.svg"
                alt="Avara Logo"
                width={32}
                height={32}
                className="object-contain [transition:none]"
              />
            </div>
            {open && <div className="ml-2 text-xl font-bold leading-tight">Avara</div>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
