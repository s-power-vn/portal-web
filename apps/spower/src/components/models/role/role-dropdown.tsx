import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

export type RoleDropdownProps = Partial<SelectInputProps>;

export const RoleDropdown: FC<RoleDropdownProps> = ({ ...props }) => {
  return <SelectInput items={props.items ?? []} {...props} />;
};
