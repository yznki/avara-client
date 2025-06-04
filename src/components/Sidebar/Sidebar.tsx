import * as React from 'react';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import DepositDialog from '@/components/Transactions/TransactionsDialogs/DepositDialog';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import TransferDialog from '../Transactions/TransactionsDialogs/TransferDialog/TransferDialog';
import WithdrawDialog from '../Transactions/TransactionsDialogs/WithdrawDialog';
import { NavLogo } from './NavLogo';
import { NavMain } from './NavMain';
import { NavSecondary } from './NavSecondary';
import { NavUser } from './NavUser';
import { SidebarNavActionsGroup } from './SidebarNavActionsGroup';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = stored === 'dark' || (!stored && prefersDark);

      document.documentElement.classList.toggle('dark', shouldUseDark);
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition mx-2"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, open } = useSidebar();

  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  const { user } = useUserContext();

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div
            className={cn(
              !open && 'flex-col',
              isMobile && 'flex-row',
              'flex items-center justify-between gap-4',
            )}
          >
            <NavLogo />
            <ThemeToggle />
          </div>
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
          {user.role === 'admin' && open && !isMobile && (
            <span className="text-xs text-muted-foreground px-2">Admin Mode</span>
          )}
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.profilePicture,
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
