import { FC, HTMLAttributes, createContext, useContext, useState } from 'react';

import { cn } from '@storeo/core';

import { Button } from '../ui/button';

const CollapseIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M249.38 336L170 256l79.38-80M181.03 256H342"
      />
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};

const ExpandIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M262.62 336L342 256l-79.38-80M330.97 256H170"
      />
      <path
        d="M256 448c106 0 192-86 192-192S362 64 256 64 64 150 64 256s86 192 192 192z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  );
};

const SidebarContext = createContext<{
  collapsed: boolean;
}>({
  collapsed: false
});

export type SidebarProps = HTMLAttributes<HTMLDivElement>;

export const Sidebar: FC<SidebarProps> = ({ children, ...props }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <div
        className={cn(
          `transition-width duration-default shadow-x-0.5 relative h-full flex-none border-r shadow-lg`,
          collapsed ? `w-12` : `w-64`
        )}
        {...props}
      >
        {children}
        <Button
          className={`absolute bottom-1 right-[0.38rem]`}
          variant={'outline'}
          size={'icon'}
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className={`h-6 w-6`}>
            {!collapsed && <CollapseIcon />}
            {collapsed && <ExpandIcon />}
          </div>
        </Button>
      </div>
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const ctx = useContext(SidebarContext);

  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return ctx;
}
