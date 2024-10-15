/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce } from 'lodash';

import React, { FC } from 'react';

import { ButtonProps } from '../index';

export const withPreventDoubleClick = (
  WrappedComponent: FC<ButtonProps>,
  time = 500
) => {
  return (props: ButtonProps) => {
    const debouncedOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log(props.onClick);

      props.onClick && props.onClick(event);
    };

    const onClick = debounce(debouncedOnClick, time, {
      leading: true,
      trailing: false
    });
    return <WrappedComponent {...props} onClick={onClick}></WrappedComponent>;
  };
};
