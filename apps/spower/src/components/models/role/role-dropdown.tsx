import { SelectInput, SelectInputProps } from '@minhdtb/storeo-theme';

import { FC } from 'react';

export type RoleDropdownProps = Partial<SelectInputProps>;

export const RoleDropdown: FC<RoleDropdownProps> = ({ ...props }) => {
  return <SelectInput items={props.items ?? []} {...props} />;
};
