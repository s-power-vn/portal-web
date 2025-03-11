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

const REGEX = {
  CONDITION_GROUP: /\([^()]+\)/g,
  DEPARTMENT: /department = ["']([^"']+)["']/,
  ROLE: /role = ["']([^"']+)["']/,
  EMPLOYEE_ID: /id = ["']([^"']+)["']/g,
  EMPLOYEE_ID_EXTRACT: /id = ["']([^"']+)["']/
};

const EmptyCondition: FC = () => (
  <div className="text-sm text-gray-500">Không có điều kiện</div>
);

type DepartmentConditionProps = {
  department: any;
  roleId?: string;
  separator: React.ReactNode;
  index: number;
};

const DepartmentCondition: FC<DepartmentConditionProps> = ({
  department,
  roleId,
  separator,
  index
}) => {
  if (!department) return null;

  const roleText = useMemo(() => {
    if (!roleId || !department.roles) return '';

    const role = _.find(department.roles, (r: any) => r.id === roleId);
    return role ? ` (${role.name})` : '';
  }, [department.roles, roleId]);

  return (
    <div key={`dept-${index}`} className="inline-flex items-center">
      <span className="rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800">
        {department.name}
        {roleText}
      </span>
      {separator}
    </div>
  );
};

type EmployeeConditionProps = {
  employeeIds: string[];
  employees: any;
  separator: React.ReactNode;
  index: number;
};

const EmployeeCondition: FC<EmployeeConditionProps> = ({
  employeeIds,
  employees,
  separator,
  index
}) => {
  return (
    <div key={`emp-${index}`} className="inline-flex items-center">
      <div className="flex flex-wrap gap-1">
        {employeeIds.map((employeeId, empIndex) => {
          const employee = _.find(employees.items, e => e.id === employeeId);

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
};

const parseConditions = (condition: string): ParsedCondition[] => {
  if (!condition) return [];

  const conditions: ParsedCondition[] = [];
  const conditionGroups = condition.match(REGEX.CONDITION_GROUP) || [];

  conditionGroups.forEach(group => {
    const groupContent = group.slice(1, -1);

    if (groupContent.includes('department =')) {
      const departmentMatch = groupContent.match(REGEX.DEPARTMENT);
      const roleMatch = groupContent.match(REGEX.ROLE);

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
          .match(REGEX.EMPLOYEE_ID)
          ?.map(match => {
            const idMatch = match.match(REGEX.EMPLOYEE_ID_EXTRACT);
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
};

const ConditionDisplayComponent: FC<ConditionDisplayProps> = ({
  condition,
  className
}) => {
  const parsedConditions = useMemo(
    () => parseConditions(condition),
    [condition]
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

  const { data: departmentsResult } = api.department.list.useSuspenseQuery();
  const departments = departmentsResult?.items || [];

  const { data: employees } = api.employee.listByCondition.useSuspenseQuery({
    variables: {
      filter: employeeIds.length
        ? employeeIds.map(id => `id = "${id}"`).join(' || ')
        : 'id = ""',
      pageIndex: 1,
      pageSize: employeeIds.length || 10
    }
  });

  if (!condition || !parsedConditions.length) {
    return <EmptyCondition />;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className || ''}`}>
      {parsedConditions.map((cond, index) => {
        const separator =
          index < parsedConditions.length - 1 ? (
            <span className="mx-2 text-gray-500"></span>
          ) : null;

        if (cond.type === 'department' && cond.departmentId) {
          const department = _.find(
            departments,
            d => d?.id === cond.departmentId
          );

          return (
            <DepartmentCondition
              key={`dept-${index}`}
              department={department}
              roleId={cond.roleId}
              separator={separator}
              index={index}
            />
          );
        } else if (cond.type === 'employee' && cond.employeeIds) {
          return (
            <EmployeeCondition
              key={`emp-${index}`}
              employeeIds={cond.employeeIds}
              employees={employees}
              separator={separator}
              index={index}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export const ConditionDisplay: FC<ConditionDisplayProps> = props => {
  if (!props.condition) {
    return <EmptyCondition />;
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
