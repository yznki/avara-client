import { useUserContext } from '@/context/UserContext'; // ⬅️ add this
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  ListOrdered,
  Users as UsersIcon,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain() {
  const location = useLocation();
  const { user } = useUserContext();
  const isAdmin = user?.role === 'admin';

  const adminItems = [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { title: 'Users', icon: UsersIcon, to: '/users' },
    { title: 'Reports', icon: BarChart3, to: '/reports' },
  ];

  const userItems = [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { title: 'Accounts', icon: CreditCard, to: '/accounts' },
    { title: 'Transactions', icon: ListOrdered, to: '/transactions' },
  ];

  const navItems = isAdmin ? adminItems : userItems;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.to}
                  className={cn(
                    'flex items-center gap-2 w-full rounded-md transition-colors duration-150',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
