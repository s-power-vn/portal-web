import { FC, useId } from 'react';

import { Label } from '@storeo/theme/components/ui/label';

import { Checkbox } from '../ui/checkbox';

export type CheckInputProps = {
  label?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
};

export const CheckInput: FC<CheckInputProps> = props => {
  const id = useId();
  return (
    <div className={'flex items-center gap-2'}>
      <Checkbox
        id={id}
        checked={props.value}
        onCheckedChange={props.onChange}
      />
      <Label htmlFor={id}>{props.label}</Label>
    </div>
  );
};
