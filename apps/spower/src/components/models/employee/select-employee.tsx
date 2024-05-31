import _ from 'lodash';

import { FC, useMemo, useState } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { employeeApi } from '../../../api';
import { EmployeeDisplay } from './employee-display';

export type SelectEmployeeProps = Omit<SelectInputProps, 'items'>;

export const SelectEmployee: FC<SelectEmployeeProps> = props => {
  const [filter, setFilter] = useState('');

  const employee = employeeApi.byId.useQuery({
    variables: props.value
  });

  const employees = employeeApi.listFirst.useQuery({
    variables: filter
  });

  const data = useMemo(() => {
    const list = (employees.data?.items ?? []).map(it => ({
      value: it.id,
      label: it.name,
      group: it.expand.department.name
    }));

    if (employee.data) {
      if (_.filter(list, it => it.value === employee.data?.id).length === 0) {
        list.push({
          value: employee.data?.id,
          label: employee.data?.name,
          group: employee.data?.expand.department.name
        });
      }
    }

    return list;
  }, [employee.data, employees.data?.items]);

  return (
    <SelectInput
      items={data}
      placeholder={'Chọn nhân viên'}
      onFilter={value => {
        setFilter(value);
      }}
      showGroups={true}
      showSearch={true}
      {...props}
    >
      {it => <EmployeeDisplay employeeId={it.value}></EmployeeDisplay>}
    </SelectInput>
  );
};
