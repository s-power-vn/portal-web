import { api } from 'portal-api';

import type { FC } from 'react';
import { useMemo } from 'react';

import type { SelectInputItem, SelectInputProps } from '@minhdtb/storeo-theme';
import { SelectInput } from '@minhdtb/storeo-theme';

import { DynamicIcon } from '../../../icon';

export type ObjectTypeDropdownProps = Omit<SelectInputProps, 'items'>;

export const ObjectTypeDropdown: FC<ObjectTypeDropdownProps> = ({
  ...props
}) => {
  const objectTypes = api.objectType.listFull.useSuspenseQuery();

  const items = useMemo(
    () =>
      objectTypes.data?.map(type => ({
        value: type.id,
        label: type.display || '',
        meta: {
          icon: type.icon,
          color: type.color
        }
      })) || [],
    [objectTypes.data]
  );

  return (
    <SelectInput items={items} {...props} showSearch>
      {(item: SelectInputItem<{ icon: string; color: string }>) => (
        <div className="flex items-center gap-2 text-sm">
          <DynamicIcon
            svgContent={item.meta?.icon}
            className={'h-4 w-4 flex-shrink-0'}
            style={{ color: item.meta?.color || '#6b7280' }}
          />
          {item.label}
        </div>
      )}
    </SelectInput>
  );
};
