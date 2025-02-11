import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox, ComboboxProps } from '../../combobox';

export type SelectEmployeeProps = ComboboxProps;

export const SelectEmployee: FC<SelectEmployeeProps> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn nhân viên"
      emptyText="Không tìm thấy nhân viên"
      queryKey={['employees']}
      queryFn={async ({ search }) => {
        const result = await api.employee.listByCondition.fetcher({
          filter: `name ~ "${search ?? ''}" || email ~ "${search ?? ''}"`,
          pageIndex: 1,
          pageSize: 10
        });

        return {
          items: result.items.map(it => ({
            label: it.name,
            value: it.id
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      className={props.className}
    />
  );
};
