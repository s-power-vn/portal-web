import { CaretSortIcon } from '@radix-ui/react-icons';

import { useState } from 'react';

import { cn } from '@storeo/core';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@storeo/theme';

export type DocumentPickProps = {
  documentId: string;
};

export const DocumentPick = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between text-sm font-normal')}
        >
          Chọn hạng mục
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content p-0">TEST</PopoverContent>
    </Popover>
  );
};
