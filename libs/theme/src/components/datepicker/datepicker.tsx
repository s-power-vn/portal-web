import { Cross2Icon } from '@radix-ui/react-icons';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DateTime } from 'luxon';

import { FC, useState } from 'react';

import { Show, cn } from '@storeo/core';

import { Timepicker } from '../timepicker';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export type DatePickerProps = {
  value?: DateTime;
  onChange?: (value: DateTime | undefined) => void;
  showTime?: boolean;
  placeholder?: string;
  className?: string;
};

export const DatePicker: FC<DatePickerProps> = props => {
  const [date, setDate] = useState<DateTime | undefined>(props.value);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={cn('flex items-center gap-2', props.className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'relative flex-1 justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Show when={date} fallback={props.placeholder ?? 'Hãy chọn ngày'}>
              {props.showTime
                ? date?.toFormat('dd/MM/yyyy HH:mm')
                : date?.toFormat('dd/MM/yyyy')}
            </Show>
            <Show when={!!date}>
              <div
                className={cn(
                  `bg-appError absolute right-2 flex h-4 w-4 items-center
                  justify-center rounded-full p-0 text-white shadow`
                )}
                onClick={e => {
                  e.stopPropagation();
                  setDate(undefined);
                  props.onChange?.(undefined);
                }}
              >
                <Cross2Icon className="h-2 w-2" />
              </div>
            </Show>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={'w-auto'} align={'start'}>
          <Calendar
            mode="single"
            locale={vi}
            selected={date?.toJSDate()}
            onSelect={v => {
              const date = v ? DateTime.fromJSDate(v) : undefined;
              setDate(old => {
                return date?.set({
                  hour: old?.hour,
                  minute: old?.minute
                });
              });
              setOpen(false);
              props.onChange?.(date);
            }}
          />
          <Show when={props.showTime}>
            <div className={'flex p-2'}>
              <Timepicker
                value={date}
                className={'flex-1'}
                onChange={v => {
                  setDate(v);
                  props.onChange?.(v);
                }}
              />
            </div>
          </Show>
        </PopoverContent>
      </Popover>
    </div>
  );
};
