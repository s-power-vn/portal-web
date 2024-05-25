import { FC, useMemo } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { employeeApi } from '../../../api';

export type SelectEmployeeProps = Omit<SelectInputProps, 'items'>;

export const SelectEmployee: FC<SelectEmployeeProps> = props => {
  const employees = employeeApi.listFull.useQuery();

  const data = useMemo(
    () =>
      (employees.data ?? []).map(it => ({
        value: it.id,
        label: it.name,
        group: it.expand.department.name
      })),
    [employees.data]
  );

  return (
    <SelectInput
      items={data}
      placeholder={'Chọn nhân viên'}
      showGroups={true}
      showSearch={true}
      {...props}
    />
  );
};
