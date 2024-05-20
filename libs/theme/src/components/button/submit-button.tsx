import { FC } from 'react';

import { Button, ButtonProps } from '../ui/button';

export const SubmitButton: FC<ButtonProps> = props => {
  return (
    <Button
      {...props}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        props.onClick?.(e);
      }}
    ></Button>
  );
};
