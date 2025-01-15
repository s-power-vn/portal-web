import type { FC } from 'react';

import type { SelectInputProps } from '@minhdtb/storeo-theme';
import { SelectInput } from '@minhdtb/storeo-theme';

export type RoleDropdownProps = Partial<SelectInputProps>;

export const RoleDropdown: FC<RoleDropdownProps> = ({ ...props }) => {
  return <SelectInput items={props.items ?? []} {...props} />;
};
