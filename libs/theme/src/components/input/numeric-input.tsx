import { InputHTMLAttributes } from 'react';

import { MaskedInput } from './masked-input';

export const NumericInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <MaskedInput mask={Number} scale={3} autofix={true} {...props} />
);
