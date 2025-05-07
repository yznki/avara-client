import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavLogo } from './NavLogo';
import { NavUser } from './NavUser';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        {/* Add buttons */}
        {/* Add navigation buttons */}
      </SidebarContent>
      <SidebarFooter>
        {/* Add sidebar controls. */}
        {/* Add Currency Selector */}
        <NavUser
          user={{
            name: 'John Doe',
            email: 'v4Kx3@example.com',
            avatar: 'https://github.com/shadcn.png',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
