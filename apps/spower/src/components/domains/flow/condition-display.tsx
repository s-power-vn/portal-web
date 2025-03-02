import _ from 'lodash';
import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import { FC, Suspense, useMemo } from 'react';

export type ConditionDisplayProps = {
  condition: string;
  className?: string;
};

type ParsedCondition = {
  type: 'department' | 'employee';
  departmentId?: string;
  roleId?: string;
  employeeIds?: string[];
};

const ConditionDisplayComponent: FC<ConditionDisplayProps> = ({
  condition,
  className
}) => {
  const parsedConditions = useMemo(() => {
    if (!condition) return [];

    const conditions: ParsedCondition[] = [];
    const conditionGroups = condition.match(/\([^()]+\)/g) || [];

    conditionGroups.forEach(group => {
      const groupContent = group.slice(1, -1);

      if (groupContent.includes('department =')) {
        const departmentMatch = groupContent.match(
          /department = ["']([^"']+)["']/
        );
        const roleMatch = groupContent.match(/role = ["']([^"']+)["']/);

        if (departmentMatch) {
          conditions.push({
            type: 'department',
            departmentId: departmentMatch[1],
            roleId: roleMatch ? roleMatch[1] : undefined
          });
        }
      } else if (groupContent.includes('id =')) {
        const employeeIds =
          groupContent
            .match(/id = ["']([^"']+)["']/g)
            ?.map(match => {
              const idMatch = match.match(/id = ["']([^"']+)["']/);
              return idMatch ? idMatch[1] : '';
            })
            .filter(Boolean) || [];

        if (employeeIds.length > 0) {
          conditions.push({
            type: 'employee',
            employeeIds
          });
        }
      }
    });

    return conditions;
  }, [condition]);

  const departmentIds = useMemo(
    () =>
      _.uniq(
        parsedConditions
          .filter(cond => cond.type === 'department' && cond.departmentId)
          .map(cond => cond.departmentId as string)
      ),
    [parsedConditions]
  );

  const employeeIds = useMemo(
    () =>
      _.uniq(
        parsedConditions
          .filter(cond => cond.type === 'employee' && cond.employeeIds)
          .flatMap(cond => cond.employeeIds as string[])
      ),
    [parsedConditions]
  );

  const departmentsQuery = api.department.listFull.useSuspenseQuery();
  const departments = departmentsQuery.data;

  const employeesQuery = api.employee.listByCondition.useSuspenseQuery({
    variables: {
      filter: employeeIds.length
        ? employeeIds.map(id => `id = "${id}"`).join(' || ')
        : 'id = ""',
      pageIndex: 1,
      pageSize: employeeIds.length || 10
    }
  });
  const employees = employeesQuery.data;

  if (!condition || !parsedConditions.length) {
    return <div className="text-sm text-gray-500">Không có điều kiện</div>;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className || ''}`}>
      {parsedConditions.map((cond, index) => {
        const separator =
          index < parsedConditions.length - 1 ? (
            <span className="mx-2 text-gray-500">||</span>
          ) : null;

        if (cond.type === 'department' && cond.departmentId) {
          const department = _.find(
            departments,
            d => d?.id === cond.departmentId
          );

          if (!department) return null;

          let roleText = '';
          if (cond.roleId && department.roles) {
            const role = _.find(
              department.roles,
              (r: any) => r.id === cond.roleId
            );
            if (role) {
              roleText = ` (${role.name})`;
            }
          }

          return (
            <div key={`dept-${index}`} className="inline-flex items-center">
              <span className="rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800">
                {department.name}
                {roleText}
              </span>
              {separator}
            </div>
          );
        } else if (cond.type === 'employee' && cond.employeeIds) {
          return (
            <div key={`emp-${index}`} className="inline-flex items-center">
              <div className="flex flex-wrap gap-1">
                {cond.employeeIds.map((employeeId, empIndex) => {
                  const employee = _.find(
                    employees.items,
                    e => e.id === employeeId
                  );

                  if (!employee) return null;

                  return (
                    <span
                      key={`emp-${index}-${empIndex}`}
                      className="rounded-md bg-green-100 px-2 py-1 text-sm text-green-800"
                    >
                      {employee.name}
                    </span>
                  );
                })}
              </div>
              {separator}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export const ConditionDisplay: FC<ConditionDisplayProps> = props => {
  if (!props.condition) {
    return <div className="text-sm text-gray-500">Không có điều kiện</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      }
    >
      <ConditionDisplayComponent {...props} />
    </Suspense>
  );
};
