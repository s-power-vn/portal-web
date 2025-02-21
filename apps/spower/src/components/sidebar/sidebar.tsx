import type { FC, HTMLAttributes } from 'react';
import { createContext, useContext } from 'react';

import { cn, usePersistedState } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

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
  expanded?: boolean;
}>({
  collapsed: false,
  expanded: false
});

export type SidebarProps = HTMLAttributes<HTMLDivElement> & {
  uid: string;
  collapsed?: boolean;
  expanded?: boolean;
};

export const Sidebar: FC<SidebarProps> = ({
  children,
  uid,
  collapsed: collapsedProp,
  expanded,
  ...props
}) => {
  const [collapsed, setCollapsed] = usePersistedState(
    collapsedProp ?? false,
    `${uid}.sidebar.collapsed`
  );

  return (
    <SidebarContext.Provider value={{ collapsed, expanded }}>
      <div
        className={cn(
          `transition-width duration-default
          flex flex-none flex-col justify-between border-r`,
          collapsed ? `w-[2.6rem]` : `w-60`
        )}
        {...props}
      >
        <div>{children}</div>
        <div className={'flex justify-end p-1'}>
          <Button
            className={`h-8 w-8 p-0`}
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
      </div>
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const ctx = useContext(SidebarContext);

  if (!ctx) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return ctx;
}
