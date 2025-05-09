import * as React from 'react';
import { useState } from 'react';
import DepositDialog from '@/components/Transactions/TransactionsDialogs/DepositDialog';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { NavLogo } from './NavLogo';
import { NavMain } from './NavMain';
import { NavSecondary } from './NavSecondary';
import { NavUser } from './NavUser';
import { SidebarNavActionsGroup } from './SidebarNavActionsGroup';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <NavLogo />
        </SidebarHeader>
        <SidebarContent>
          {/* TODO: When implementing the transactions add the modal control here. */}
          <SidebarNavActionsGroup
            onDeposit={() => setIsDepositDialogOpen(true)}
            onWithdraw={function (): void {
              throw new Error('Function not implemented.');
            }}
            onTransfer={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
          <NavMain />
          <NavSecondary />
        </SidebarContent>
        <SidebarFooter>
          {/* TODO: When adding api, change this to a user. */}
          <NavUser
            user={{
              name: 'John Doe',
              email: 'v4Kx3@example.com',
              avatar: 'https://github.com/shadcn.png',
            }}
          />
        </SidebarFooter>
      </Sidebar>
      <DepositDialog
        isVisible={isDepositDialogOpen}
        setIsVisible={setIsDepositDialogOpen}
        onConfirm={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </>
  );
}
