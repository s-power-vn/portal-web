import { InputHTMLAttributes } from 'react';

import { MaskedInput } from './masked-input';

export const IntegerInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <MaskedInput mask={Number} scale={0} autofix={true} {...props} />
);
