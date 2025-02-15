import { X } from 'lucide-react';

import { FC } from 'react';

export type PropertySidebarProps = {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  width: number;
};

export const PropertySidebar: FC<PropertySidebarProps> = ({
  title,
  children,
  onClose,
  width
}) => {
  return (
    <div
      className="bg-background relative flex flex-none flex-col"
      style={{ width: `${width}px` }}
    >
      <div className="border-border bg-appBlue flex items-center justify-between border-b p-4">
        <h3 className="text-appWhite text-lg font-semibold leading-none">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-appWhite hover:text-appWhite/80 rounded p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};
