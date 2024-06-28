import { Cross2Icon } from '@radix-ui/react-icons';
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

  return (
    <div className={cn('flex items-center gap-2', props.className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'flex-1 justify-start text-left font-normal ',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Show when={date} fallback={props.placeholder ?? 'Hãy chọn ngày'}>
              {date?.toFormat('dd/MM/yyyy')}
            </Show>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date?.toJSDate()}
            onSelect={v => {
              const date = v ? DateTime.fromJSDate(v) : undefined;
              setDate(date);
              props.onChange?.(date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Show when={props.showTime}>
        <Timepicker
          value={date}
          onChange={v => {
            setDate(v);
            props.onChange?.(v);
          }}
        />
      </Show>
      <Show when={!!date}>
        <Button
          variant={'outline'}
          className={cn(
            'text-muted-foreground h-6 w-6 justify-center rounded-full p-0'
          )}
          onClick={() => {
            setDate(undefined);
            props.onChange?.(undefined);
          }}
        >
          <Cross2Icon className="h-3 w-3" />
        </Button>
      </Show>
    </div>
  );
};
