import { yupResolver } from '@hookform/resolvers/yup';
import { DepartmentData } from 'libs/api/src/api/department';
import _ from 'lodash';
import { NetworkIcon, Plus, Trash2, User } from 'lucide-react';
import { api } from 'portal-api';
import * as yup from 'yup';

import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { UseFormSetValue, useFieldArray, useForm } from 'react-hook-form';

import { Button, SelectInput } from '@minhdtb/storeo-theme';

import { DepartmentDropdown } from '../department';
import { SelectEmployee } from '../employee';
import { RoleDropdown } from '../role';

type ConditionType = 'department' | 'employee';

type DepartmentSubCondition = {
  id: string;
  type: 'department';
  departmentId: string;
  role?: string;
};

type EmployeeSubCondition = {
  id: string;
  type: 'employee';
  employeeIds: string[];
};

type SubCondition = DepartmentSubCondition | EmployeeSubCondition;

type ConditionFormValues = {
  conditions: SubCondition[];
};

// Create a more specific type for form errors
type ConditionErrors = {
  conditions?: Array<{
    id?: { message?: string };
    type?: { message?: string };
    departmentId?: { message?: string };
    role?: { message?: string };
    employeeIds?: { message?: string };
  }>;
};

type Department = {
  id: string;
  name: string;
  roles?: { id: string; name: string }[];
};

const isDepartmentCondition = (
  cond: SubCondition
): cond is DepartmentSubCondition => {
  return cond.type === 'department';
};

const isEmployeeCondition = (
  cond: SubCondition
): cond is EmployeeSubCondition => {
  return cond.type === 'employee';
};

// Validation schema - Modified to address typing issues
const conditionsSchema = yup.object().shape({
  id: yup.string().required(),
  type: yup.string().oneOf(['department', 'employee']).required(),
  departmentId: yup.string().when('type', {
    is: 'department',
    then: schema => schema.required('Phòng ban là bắt buộc'),
    otherwise: schema => schema.optional()
  }),
  role: yup.string().optional(),
  employeeIds: yup
    .array()
    .of(yup.string())
    .when('type', {
      is: 'employee',
      then: schema => schema.min(1, 'Phải chọn ít nhất một nhân viên'),
      otherwise: schema => schema.optional()
    })
});

// Main schema - Removed operator
const schema = yup.object().shape({
  conditions: yup
    .array()
    .of(conditionsSchema)
    .min(1, 'Phải có ít nhất một điều kiện')
    .required()
});

// Employee dropdown component for selecting employees
type EmployeeDropdownProps = Omit<
  React.ComponentProps<typeof SelectInput>,
  'items'
>;

const EmployeeDropdown: FC<EmployeeDropdownProps> = ({ ...props }) => {
  const [employees, setEmployees] = useState<
    Array<{
      id: string;
      name: string;
      email?: string;
      department?: string;
    }>
  >([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await api.employee.list.fetcher({
          filter: '', // Empty filter to get all employees
          pageIndex: 1,
          pageSize: 200
        });

        setEmployees(
          result.items.map(emp => ({
            id: emp.id,
            name: emp.name,
            email: emp.email,
            department: emp.expand?.department?.name
          }))
        );
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const items = useMemo(
    () =>
      _.map(employees, ({ id, name, email, department }) => ({
        value: id,
        label: name,
        description: email,
        group: department
      })),
    [employees]
  );

  return <SelectInput {...props} items={items} multiple={true} />;
};

// Memoized Condition Block component to prevent unnecessary re-renders
type ConditionBlockProps = {
  condition: SubCondition;
  index: number;
  departments: DepartmentData[];
  formErrors: ConditionErrors;
  setValue: UseFormSetValue<ConditionFormValues>;
  onRemove: (index: number) => void;
};

const ConditionBlock = memo(
  ({
    condition,
    index,
    departments,
    formErrors,
    setValue,
    onRemove
  }: ConditionBlockProps) => {
    // Local state to force re-render when department changes
    const [localDeptId, setLocalDeptId] = useState(
      isDepartmentCondition(condition) ? condition.departmentId : ''
    );
    const [localRole, setLocalRole] = useState(
      isDepartmentCondition(condition) ? condition.role || '' : ''
    );

    // Update local state when condition changes from parent
    useEffect(() => {
      if (isDepartmentCondition(condition)) {
        setLocalDeptId(condition.departmentId);
        setLocalRole(condition.role || '');
      }
    }, [condition]);

    // Get current department and its roles
    const currentDepartment = useMemo(
      () =>
        departments.find(
          dept => isDepartmentCondition(condition) && dept.id === localDeptId
        ),
      [departments, condition, localDeptId]
    );

    const departmentRoles = useMemo(
      () => currentDepartment?.roles || [],
      [currentDepartment]
    );

    const handleDepartmentChange = useCallback(
      (value: string) => {
        setLocalDeptId(value);
        setLocalRole('');
        setValue(`conditions.${index}.departmentId`, value, {
          shouldValidate: true
        });
        setValue(`conditions.${index}.role`, undefined);
      },
      [setValue, index]
    );

    const handleRoleChange = useCallback(
      (value: string) => {
        const newValue = value === 'none' ? '' : value;
        setLocalRole(newValue);
        setValue(
          `conditions.${index}.role`,
          value === 'none' ? undefined : value
        );
      },
      [setValue, index]
    );

    const handleEmployeeChange = useCallback(
      (value: string | string[]) => {
        setValue(
          `conditions.${index}.employeeIds`,
          Array.isArray(value) ? value : [],
          {
            shouldValidate: true
          }
        );
      },
      [setValue, index]
    );

    const handleRemove = useCallback(() => {
      onRemove(index);
    }, [onRemove, index]);

    return (
      <div className="relative rounded-md border p-3">
        <div className="bg-background absolute -top-3 right-2 px-2 text-sm font-medium">
          {condition.type === 'department'
            ? 'Điều kiện phòng ban'
            : 'Điều kiện nhân viên'}
        </div>

        {isDepartmentCondition(condition) && (
          <div className="mt-2 space-y-3">
            <div className="mb-2 flex items-center gap-1 text-sm font-medium">
              <NetworkIcon className="h-4 w-4" />
              Phòng ban
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Phòng ban<span className="text-destructive">*</span>
              </label>
              <DepartmentDropdown
                value={localDeptId}
                onChange={value => handleDepartmentChange(value as string)}
                showClear={false}
              />
              {formErrors.conditions?.[index]?.departmentId && (
                <p className="text-destructive mt-1 text-sm">
                  {formErrors.conditions[index]?.departmentId?.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Chức danh
              </label>
              <RoleDropdown
                items={departmentRoles.map(role => ({
                  value: role.id,
                  label: role.name
                }))}
                value={localRole}
                onChange={value => handleRoleChange(value as string)}
                placeholder="Chọn chức danh"
              />
            </div>
          </div>
        )}

        {isEmployeeCondition(condition) && (
          <div className="mt-2">
            <div className="mb-2 flex items-center gap-1 text-sm font-medium">
              <User className="h-4 w-4" />
              Nhân viên
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Nhân viên <span className="text-destructive">*</span>
              </label>
              <SelectEmployee
                value={condition.employeeIds}
                onChange={handleEmployeeChange}
                placeholder="Chọn nhân viên"
                multiple={true}
              />
              {formErrors.conditions?.[index]?.employeeIds && (
                <p className="text-destructive mt-1 text-sm">
                  {formErrors.conditions[index]?.employeeIds?.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
          >
            <Trash2 className="mr-1 h-4 w-4" /> Xóa điều kiện
          </Button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the specific condition changed or if the departments data changed
    return (
      prevProps.index === nextProps.index &&
      prevProps.condition.id === nextProps.condition.id &&
      prevProps.condition.type === nextProps.condition.type &&
      (isDepartmentCondition(prevProps.condition) &&
      isDepartmentCondition(nextProps.condition)
        ? prevProps.condition.departmentId ===
            nextProps.condition.departmentId &&
          prevProps.condition.role === nextProps.condition.role
        : isEmployeeCondition(prevProps.condition) &&
            isEmployeeCondition(nextProps.condition)
          ? _.isEqual(
              prevProps.condition.employeeIds,
              nextProps.condition.employeeIds
            )
          : false) &&
      _.isEqual(
        prevProps.formErrors.conditions?.[prevProps.index],
        nextProps.formErrors.conditions?.[nextProps.index]
      ) &&
      prevProps.departments.length === nextProps.departments.length
    );
  }
);

ConditionBlock.displayName = 'ConditionBlock';

// Props interface
export type EmployeeConditionGeneratorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export const EmployeeConditionGenerator: FC<
  EmployeeConditionGeneratorProps
> = ({ value, onChange }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ConditionFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      conditions: []
    }
  });

  const formErrors = errors as unknown as ConditionErrors;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions'
  });

  const watchConditions = watch('conditions');

  // Scroll to bottom when a new condition is added
  useEffect(() => {
    if (scrollContainerRef.current && fields.length > 0) {
      // Use a small timeout to ensure the DOM has updated
      setTimeout(() => {
        const lastCondition = scrollContainerRef.current?.querySelector(
          '.space-y-4 > div:last-child'
        );
        if (lastCondition) {
          lastCondition.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
          // Fallback to the standard scroll if we can't find the last element
          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, [fields.length]);

  // Parse initial value if provided
  useEffect(() => {
    if (value) {
      try {
        // Parse the condition string into our form structure
        // Example: "(department = 'dept1' && role = 'role1') || (id = 'emp1' || id = 'emp2')"
        const parsedConditions: SubCondition[] = [];

        // For each condition group (wrapped in parentheses)
        const conditionGroups = value.match(/\([^()]+\)/g) || [];

        conditionGroups.forEach((group, index) => {
          const groupContent = group.slice(1, -1); // Remove parentheses

          if (groupContent.includes('department =')) {
            // Department condition
            const departmentMatch = groupContent.match(
              /department = ['"]([^'"]+)['"]/
            );
            const roleMatch = groupContent.match(/role = ['"]([^'"]+)['"]/);

            if (departmentMatch) {
              parsedConditions.push({
                id: `dept_${index}`,
                type: 'department',
                departmentId: departmentMatch[1],
                role: roleMatch ? roleMatch[1] : undefined
              });
            }
          } else if (groupContent.includes('id =')) {
            // Employee condition
            const employeeIds =
              groupContent
                .match(/id = ['"]([^'"]+)['"]/g)
                ?.map(match => {
                  const idMatch = match.match(/id = ['"]([^'"]+)['"]/);
                  return idMatch ? idMatch[1] : '';
                })
                .filter(Boolean) || [];

            parsedConditions.push({
              id: `emp_${index}`,
              type: 'employee',
              employeeIds
            });
          }
        });

        reset({
          conditions: parsedConditions.length > 0 ? parsedConditions : []
        });
      } catch (error) {
        console.error('Failed to parse condition:', error);
        // Default to empty condition list
        reset({
          conditions: []
        });
      }
    } else {
      // Default to empty condition list if no value
      reset({
        conditions: []
      });
    }
  }, [value, reset]);

  // Generate condition string from form values
  const generateConditionString = useCallback(
    (data: ConditionFormValues): string => {
      if (data.conditions.length === 0) return '';

      const conditionParts = data.conditions
        .map(condition => {
          if (condition.type === 'department') {
            let departmentCondition = `department = "${condition.departmentId}"`;
            if (condition.role) {
              departmentCondition += ` && role = "${condition.role}"`;
            }
            return `(${departmentCondition})`;
          } else if (condition.type === 'employee') {
            if (condition.employeeIds.length === 0) return '';

            if (condition.employeeIds.length === 1) {
              return `(id = "${condition.employeeIds[0]}")`;
            }

            const employeeConditions = condition.employeeIds
              .map(id => `id = "${id}"`)
              .join(' || ');

            return `(${employeeConditions})`;
          }
          return '';
        })
        .filter(Boolean);

      // Always use OR operator
      return conditionParts.join(' || ');
    },
    []
  );

  // Handle form submission
  const onSubmit = useCallback(
    (data: ConditionFormValues) => {
      const conditionString = generateConditionString(data);
      onChange?.(conditionString);
    },
    [generateConditionString, onChange]
  );

  // Add new sub-condition
  const addCondition = useCallback(
    (type: ConditionType) => {
      const newId = `${type}_${Date.now()}`;

      if (type === 'department') {
        append({ id: newId, type, departmentId: '' } as DepartmentSubCondition);
      } else {
        append({ id: newId, type, employeeIds: [] } as EmployeeSubCondition);
      }
    },
    [append]
  );

  // Memoized handler for removing conditions
  const handleRemoveCondition = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const formValues = watch();
  const conditionString = useMemo(
    () => generateConditionString(formValues),
    [formValues, generateConditionString]
  );

  const handleAddDepartmentCondition = useCallback(
    () => addCondition('department'),
    [addCondition]
  );

  const handleAddEmployeeCondition = useCallback(
    () => addCondition('employee'),
    [addCondition]
  );

  const handleFormSubmit = useCallback(
    () => handleSubmit(onSubmit)(),
    [handleSubmit, onSubmit]
  );

  const departments = api.department.listFull.useSuspenseQuery();

  return (
    <div className="flex h-full max-h-[calc(100vh-250px)] flex-col">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth pr-1"
      >
        <div className="space-y-4">
          {fields.map((field, index) => {
            const condition = watchConditions[index];

            if (!condition) return null;

            return (
              <ConditionBlock
                key={field.id}
                condition={condition}
                index={index}
                departments={departments.data}
                formErrors={formErrors}
                setValue={setValue}
                onRemove={handleRemoveCondition}
              />
            );
          })}
        </div>
        {fields.length === 0 && (
          <div className="text-muted-foreground my-6 text-center text-sm">
            Chưa có điều kiện nào. Vui lòng thêm điều kiện bên dưới.
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddDepartmentCondition}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" /> Thêm điều kiện phòng ban
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddEmployeeCondition}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" /> Thêm điều kiện nhân viên
          </Button>
        </div>
      </div>
      <div className="mt-4 border-t pt-3">
        <div className="mb-1 text-sm font-medium">Điều kiện đã tạo:</div>
        <pre className="bg-muted overflow-auto rounded p-2 text-xs">
          {conditionString}
        </pre>
        <Button
          type="button"
          onClick={handleFormSubmit}
          className="mt-2 w-full"
        >
          Cập nhật điều kiện
        </Button>
      </div>
    </div>
  );
};
