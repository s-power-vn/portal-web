import { Ref } from 'react';
import { IMaskMixin } from 'react-imask';

import { Input } from '../ui/input';

export const MaskedInput = IMaskMixin(
  ({ inputRef, ...props }: { inputRef: Ref<HTMLInputElement> }) => (
    <Input {...props} ref={inputRef} />
  )
);
