import { FC } from 'react';

import { withPreventDoubleClick } from '../../hoc';
import { ThemeButton, ThemeButtonProps } from '../ui/button';

export type ButtonProps = ThemeButtonProps & {
  tooltip?: string;
};

const CustomSubmitButton: FC<ButtonProps> = props => {
  return (
    <ThemeButton {...props} onClick={e => props.onClick?.(e)}></ThemeButton>
  );
};

export const Button = withPreventDoubleClick(CustomSubmitButton);
