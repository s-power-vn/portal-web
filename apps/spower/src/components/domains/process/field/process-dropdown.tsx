import { api } from 'portal-api';

import { FC, useMemo } from 'react';

import { SelectInput, type SelectInputProps } from '@minhdtb/storeo-theme';

export type ProcessDropdownProps = Omit<SelectInputProps, 'items'>;

export const ProcessDropdown: FC<ProcessDropdownProps> = ({ ...props }) => {
  const processes = api.process.listFull.useSuspenseQuery();

  const items = useMemo(() => {
    return (
      processes.data?.map(process => ({
        value: process.id,
        label: process.name || ''
      })) || []
    );
  }, [processes.data]);

  return <SelectInput items={items} {...props} showSearch />;
};
