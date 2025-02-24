import { X } from 'lucide-react';

import { FC } from 'react';

export type PropertySidebarProps = {
  children: React.ReactNode;
  onClose?: () => void;
  onAddNode?: () => void;
  width: number;
  title?: string;
};

export const PropertySidebar: FC<PropertySidebarProps> = ({
  children,
  onClose,
  onAddNode,
  width,
  title
}) => {
  return (
    <div
      className="bg-background relative flex h-full flex-col overflow-hidden"
      style={{ width: `${width}px` }}
    >
      <div className="border-border bg-appBlue flex h-10 shrink-0 items-center justify-between px-2">
        <span className="text-appWhite text-sm font-medium">{title}</span>
        <button
          onClick={onClose}
          className="text-appWhite flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};
