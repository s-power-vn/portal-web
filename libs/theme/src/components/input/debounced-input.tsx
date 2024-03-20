import { FC, InputHTMLAttributes, useEffect, useState } from 'react';

import { Input } from '../ui/input';


export type DebouncedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  debounce?: number;
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
};

export const DebouncedInput: FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    ></Input>
  );
};
