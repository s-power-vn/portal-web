import _ from 'lodash';
import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox } from '../../combobox';

export type SelectEmployeeByConditionProps = Omit<
  React.ComponentProps<typeof Combobox>,
  'queryKey' | 'queryFn' | 'itemToString' | 'itemToValue'
> & {
  condition?: string;
};

export const SelectEmployeeByCondition: FC<
  SelectEmployeeByConditionProps
> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn nhân viên"
      queryKey={['employees', props.condition ?? '']}
      queryFn={async ({ search, page }) => {
        const filter = props.condition
          ? `(${props.condition}) && (name ~ "${search ?? ''}" || email ~ "${search ?? ''}")`
          : `name ~ "${search ?? ''}" || email ~ "${search ?? ''}"`;

        const result = await api.employee.listByCondition.fetcher({
          filter,
          pageIndex: page,
          pageSize: 10
        });

        return {
          items: result.items.map(it => ({
            label: it.name,
            value: it.id,
            group: it.expand.department.name
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      className={props.className}
    />
  );
};
