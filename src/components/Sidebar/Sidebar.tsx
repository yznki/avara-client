import * as React from 'react';
import { useState } from 'react';
import DepositDialog from '@/components/Transactions/TransactionsDialogs/DepositDialog';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import TransferDialog from '../Transactions/TransactionsDialogs/TransferDialog/TransferDialog';
import WithdrawDialog from '../Transactions/TransactionsDialogs/WithdrawDialog';
import { NavLogo } from './NavLogo';
import { NavMain } from './NavMain';
import { NavSecondary } from './NavSecondary';
import { NavUser } from './NavUser';
import { SidebarNavActionsGroup } from './SidebarNavActionsGroup';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <NavLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavActionsGroup
            onDeposit={() => setIsDepositDialogOpen(true)}
            onWithdraw={() => setIsWithdrawDialogOpen(true)}
            onTransfer={() => setIsTransferDialogOpen(true)}
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
      <DepositDialog isVisible={isDepositDialogOpen} setIsVisible={setIsDepositDialogOpen} />
      <WithdrawDialog isVisible={isWithdrawDialogOpen} setIsVisible={setIsWithdrawDialogOpen} />
      <TransferDialog isVisible={isTransferDialogOpen} setIsVisible={setIsTransferDialogOpen} />
    </>
  );
}
