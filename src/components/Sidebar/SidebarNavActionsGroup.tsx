'use client';

import { useUserContext } from '@/context/UserContext';
import { ArrowDownToLine, ArrowUpToLine, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export function SidebarNavActionsGroup({
  onDeposit,
  onWithdraw,
  onTransfer,
}: {
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}) {
  const { state, isMobile } = useSidebar();
  const isExpanded = state === 'expanded';

  const { user } = useUserContext();
  if (user?.role === 'admin') return null;

  const actions = [
    {
      label: 'Deposit',
      icon: <ArrowDownToLine className="size-4" />,
      onClick: onDeposit,
    },
    {
      label: 'Withdraw',
      icon: <ArrowUpToLine className="size-4" />,
      onClick: onWithdraw,
    },
    {
      label: 'Transfer',
      icon: <Banknote className="size-4" />,
      onClick: onTransfer,
    },
  ];

  return (
    <div className="flex flex-col items-stretch gap-2 p-2 pt-2">
      {actions.map(({ label, icon, onClick }) => (
        <Button
          key={label}
          onClick={onClick}
          variant="sidebar"
          className={cn(!isExpanded && !isMobile && 'justify-center px-0 w-8 h-8')}
        >
          {icon}
          {(isExpanded || isMobile) && <span className="font-medium text-base">{label}</span>}
        </Button>
      ))}
    </div>
  );
}
