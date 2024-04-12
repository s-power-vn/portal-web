import { InputHTMLAttributes, forwardRef } from 'react';

import { MaskedInput } from './masked-input';

export const IntegerInput = forwardRef(
  (props: InputHTMLAttributes<HTMLInputElement>, ref) => (
    <MaskedInput mask={Number} scale={0} autofix={true} ref={ref} {...props} />
  )
);
