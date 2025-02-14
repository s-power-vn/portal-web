import { GripVertical, X } from 'lucide-react';

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@minhdtb/storeo-core';

export type PropertySidebarProps = {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export const PropertySidebar: FC<PropertySidebarProps> = ({
  title,
  children,
  onClose
}) => {
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.pageX;
    startWidthRef.current = sidebarRef.current?.offsetWidth ?? 300;
    setIsResizing(true);
  }, []);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = startXRef.current - e.pageX;
      const newWidth = Math.min(
        Math.max(startWidthRef.current + diff, 200),
        300
      );
      setWidth(newWidth);
    },
    [isResizing]
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResizing);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, handleResize, stopResizing]);

  return (
    <div
      ref={sidebarRef}
      className="border-border bg-background relative flex flex-none flex-col border-l"
      style={{ width: `${width}px` }}
    >
      <div className="border-border bg-appBlue flex items-center justify-between border-b p-2">
        <h3 className="text-appWhite text-lg font-medium">{title}</h3>
        <button
          onClick={onClose}
          className="text-appWhite hover:text-appWhite/80 rounded p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div
        className={cn(
          'hover:bg-appBlue/5 group absolute -left-2 top-0 z-50 flex h-full w-4 cursor-col-resize items-center justify-center',
          isResizing && 'bg-appBlue/10'
        )}
        onMouseDown={startResizing}
      >
        <GripVertical className="text-muted-foreground/50 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {children}
    </div>
  );
};
