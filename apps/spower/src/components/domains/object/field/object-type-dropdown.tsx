import { api } from 'portal-api';

import type { FC } from 'react';
import { useMemo } from 'react';

import type { SelectInputProps } from '@minhdtb/storeo-theme';
import { SelectInput } from '@minhdtb/storeo-theme';

export type ObjectTypeDropdownProps = Omit<SelectInputProps, 'items'>;

export const ObjectTypeDropdown: FC<ObjectTypeDropdownProps> = ({
  ...props
}) => {
  const objectTypes = api.objectType.listFull.useSuspenseQuery();

  const items = useMemo(
    () =>
      objectTypes.data?.map(type => ({
        value: type.id,
        label: type.name || '',
        icon: type.icon,
        color: type.color
      })) || [],
    [objectTypes.data]
  );

  return <SelectInput items={items} {...props} />;
};
