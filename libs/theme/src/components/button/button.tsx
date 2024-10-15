import { FC } from 'react';

import { withPreventDoubleClick } from '../../hoc';
import { ButtonProps, ThemeButton } from '../ui/button';

const CustomSubmitButton: FC<ButtonProps> = props => {
  return (
    <ThemeButton
      {...props}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        props.onClick?.(e);
      }}
    ></ThemeButton>
  );
};

export const Button = withPreventDoubleClick(CustomSubmitButton);
