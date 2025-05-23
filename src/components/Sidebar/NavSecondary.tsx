'use client';

import { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { SettingsDialog } from '../SettingsDialog';
import { CurrencySelect } from './CurrencySelect';

export function NavSecondary() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  const [isSettingsDialogVisible, setIsSettingsDialogVisible] = useState(false);

  const secondaryNav = [
    { icon: Settings, label: 'Settings', onClick: () => setIsSettingsDialogVisible(true) },
    { icon: Search, label: 'Search', onClick: () => {} },
  ];

  return (
    <>
      <SidebarGroup className="mt-auto pb-2">
        <SidebarMenu>
          {secondaryNav.map(({ icon: Icon, label, onClick }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                onClick={onClick}
                className={cn(
                  'flex items-center gap-2 w-full rounded-md text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isCollapsed && 'justify-center size-8 p-0 mx-auto',
                )}
              >
                <Icon className="size-4" />
                {!isCollapsed && <span>{label}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <CurrencySelect />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SettingsDialog isOpen={isSettingsDialogVisible} setIsOpen={setIsSettingsDialogVisible} />
    </>
  );
}
