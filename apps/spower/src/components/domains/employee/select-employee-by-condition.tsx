import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox, ComboboxProps } from '../../combobox';

export type SelectEmployeeByConditionProps = Partial<ComboboxProps> & {
  condition?: string;
};

export const SelectEmployeeByCondition: FC<
  SelectEmployeeByConditionProps
> = props => {
  return (
    <Combobox
      {...props}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder ?? 'Chọn nhân viên'}
      emptyText={props.emptyText ?? 'Không tìm thấy nhân viên'}
      queryKey={['employees', props.condition ?? '']}
      queryFn={async ({ search, page }) => {
        const filter = props.condition
          ? `(${props.condition}) && (name ~ "${search ?? ''}" || email ~ "${search ?? ''}")`
          : `name ~ "${search ?? ''}" || email ~ "${search ?? ''}"`;

        const result = await api.employee.listByCondition.fetcher({
          filter,
          pageIndex: page ?? 1,
          pageSize: 10
        });

        return {
          items: result.items.map(it => ({
            label: it.name,
            value: it.id,
            group: it.expand?.department.name,
            subLabel: it.email
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      className={props.className}
    />
  );
};
