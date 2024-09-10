import { FC } from 'react';

import { withPreventDoubleClick } from '../../hoc';
import { Button, ButtonProps } from '../ui/button';

const CustomSubmitButton: FC<ButtonProps> = props => {
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

export const SubmitButton = withPreventDoubleClick(CustomSubmitButton);
