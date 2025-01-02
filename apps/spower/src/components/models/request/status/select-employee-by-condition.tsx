import { SelectInput, SelectInputProps } from '@minhdtb/storeo-theme';
import _ from 'lodash';

import { FC, useMemo, useState } from 'react';

import { employeeApi } from '../../../../api';
import { EmployeeDisplay } from '../../employee/employee-display';

export type SelectEmployeeByConditionProps = Omit<SelectInputProps, 'items'> & {
  condition?: string;
};

export const SelectEmployeeByCondition: FC<
  SelectEmployeeByConditionProps
> = props => {
  const [filter, setFilter] = useState('');

  const selectedEmployee = employeeApi.byId.useQuery({
    variables: props.value
  });

  const listEmployees = employeeApi.listByCondition.useQuery({
    variables: `${props.condition ?? ''}${filter ? `&& name ~ "${filter}"` : ''}`
  });

  const data = useMemo(() => {
    const list = (listEmployees.data?.items ?? []).map(it => ({
      value: it.id,
      label: it.name,
      group: it.expand.department.name
    }));

    if (selectedEmployee.data) {
      if (
        _.filter(list, it => it.value === selectedEmployee.data?.id).length ===
        0
      ) {
        list.push({
          value: selectedEmployee.data?.id,
          label: selectedEmployee.data?.name,
          group: selectedEmployee.data?.expand.department.name
        });
      }
    }

    return list;
  }, [listEmployees.data?.items, selectedEmployee.data]);

  return (
    <SelectInput
      items={data}
      placeholder={'Chọn nhân viên'}
      align={'start'}
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
