import { Cross2Icon } from '@radix-ui/react-icons';

import { FC, InputHTMLAttributes, useEffect, useState } from 'react';

import { Button } from '../button';
import { Input } from '../ui/input';

export type DebouncedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  value?: string;
  debounce?: number;
  onChange?: (value: string | undefined) => void;
};

export const DebouncedInput: FC<DebouncedInputProps> = ({
  value: initialValue = '',
  onChange,
  debounce = 300,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange?.(value);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return (
    <div className={'relative flex w-min'}>
      <Input
        {...props}
        value={value}
        onChange={e => setValue(e.target.value)}
      ></Input>
      {value ? (
        <Button
          variant={'outline'}
          className={'absolute right-[6px] top-[6px] h-5 w-5 rounded-full p-0'}
          onClick={() => setValue('')}
        >
          <Cross2Icon className={'h-3 w-3'} />
        </Button>
      ) : null}
    </div>
  );
};
