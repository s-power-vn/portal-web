import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox, ComboboxProps } from '../../combobox';

export type SelectEmployeeProps = Partial<ComboboxProps>;

export const SelectEmployee: FC<SelectEmployeeProps> = props => {
  return (
    <Combobox
      {...props}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder ?? 'Chọn nhân viên'}
      emptyText={props.emptyText ?? 'Không tìm thấy nhân viên'}
      queryKey={['employees']}
      queryFn={async ({ search, page }) => {
        const result = await api.employee.listByCondition.fetcher({
          filter: `name ~ "${search ?? ''}" || email ~ "${search ?? ''}"`,
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
