'use client';

import { useUserContext } from '@/context/UserContext';
import { Link } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavLogo() {
  const { open } = useSidebar();

  const { user } = useUserContext();

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
              <svg
                width={40}
                height={35}
                viewBox="0 0 40 35"
                xmlns="http://www.w3.org/2000/svg"
                className={`object-contain [transition:none] ${user?.role === 'admin' ? 'text-[#c8102e]' : 'text-[#0052cc]'}`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.247 0.0583801L30.4582 25.62L30.445 25.6541L27.0266 34.4969L22.9742 25.2492H10.0253L7.5222 31.2831H0L12.4034 0H20.2238L20.247 0.0583801ZM12.1481 19.3082H20.8554L16.2626 8.09834L12.1481 19.3082Z"
                  fill="currentColor"
                />
                <path
                  d="M40 0.000260216H32.3981L27.5774 12.7175L31.5638 22.3716L40 0.000260216Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {open && <div className="text-xl font-bold leading-tight">Avara</div>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
