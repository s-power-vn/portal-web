import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { NetworkIcon, Plus, Trash2, UsersIcon } from 'lucide-react';
import { DepartmentData, api } from 'portal-api';
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

import { Button } from '@minhdtb/storeo-theme';

import { DepartmentDropdown } from '../department';
import { SelectEmployee } from '../employee';
import { RoleDropdown } from '../role';
import { ConditionDisplay } from './condition-display';

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

type ConditionErrors = {
  conditions?: Array<{
    id?: { message?: string };
    type?: { message?: string };
    departmentId?: { message?: string };
    role?: { message?: string };
    employeeIds?: { message?: string };
  }>;
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

const schema = yup.object().shape({
  conditions: yup
    .array()
    .of(conditionsSchema)
    .min(1, 'Phải có ít nhất một điều kiện')
    .required()
});

type ConditionBlockProps = {
  condition: SubCondition;
  index: number;
  formErrors: ConditionErrors;
  formSubmitted: boolean;
  showEmployeeError: boolean;
  showDepartmentError: boolean;
  setValue: UseFormSetValue<ConditionFormValues>;
  onRemove: (index: number) => void;
  clearError: (type: 'department' | 'employee', index: number) => void;
};

const ConditionBlock = memo(
  ({
    condition,
    index,
    formSubmitted,
    showEmployeeError,
    showDepartmentError,
    setValue,
    onRemove,
    clearError
  }: ConditionBlockProps) => {
    const [localDeptId, setLocalDeptId] = useState(
      isDepartmentCondition(condition) ? condition.departmentId : ''
    );
    const [localRole, setLocalRole] = useState(
      isDepartmentCondition(condition) ? condition.role || '' : ''
    );

    useEffect(() => {
      if (isDepartmentCondition(condition)) {
        setLocalDeptId(condition.departmentId);
        setLocalRole(condition.role || '');
      }
    }, [condition]);

    let currentDepartment: DepartmentData | undefined;
    try {
      const queryId =
        isDepartmentCondition(condition) && localDeptId
          ? localDeptId
          : undefined;

      const { data } = api.department.byId.useSuspenseQuery({
        variables: queryId
      });

      if (isDepartmentCondition(condition) && localDeptId) {
        currentDepartment = data;
      }
    } catch (error) {
      currentDepartment = undefined;
    }

    const departmentRoles = useMemo(
      () => currentDepartment?.roles || [],
      [currentDepartment]
    );

    const handleDepartmentChange = useCallback(
      (value: string | string[]) => {
        const departmentId = Array.isArray(value) ? value[0] || '' : value;
        setLocalDeptId(departmentId);
        setLocalRole('');

        if (departmentId) {
          clearError('department', index);
        }

        setValue(`conditions.${index}.departmentId`, departmentId, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        setValue(`conditions.${index}.role`, undefined, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      },
      [setValue, index, clearError]
    );

    const handleRoleChange = useCallback(
      (value: string) => {
        const newValue = value === 'none' ? '' : value;
        setLocalRole(newValue);
        setValue(
          `conditions.${index}.role`,
          value === 'none' ? undefined : value,
          {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          }
        );
      },
      [setValue, index]
    );

    const handleEmployeeChange = useCallback(
      (value: string | string[]) => {
        const employeeIds = Array.isArray(value) ? value : [];

        if (employeeIds.length > 0) {
          clearError('employee', index);
        }

        setValue(`conditions.${index}.employeeIds`, employeeIds, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      },
      [setValue, index, clearError]
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
                onChange={handleDepartmentChange}
                showClear={false}
              />
              {formSubmitted && showDepartmentError && !localDeptId && (
                <p className="text-destructive mt-1 text-sm">
                  Phòng ban là bắt buộc
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Chức danh
              </label>
              <RoleDropdown
                items={departmentRoles.map(
                  (role: { id: string; name: string }) => ({
                    value: role.id,
                    label: role.name
                  })
                )}
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
              <UsersIcon className="h-4 w-4" />
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
              {formSubmitted &&
                showEmployeeError &&
                isEmployeeCondition(condition) &&
                condition.employeeIds.length === 0 && (
                  <p className="text-destructive mt-1 text-sm">
                    Phải chọn ít nhất một nhân viên
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
    if (
      prevProps.formSubmitted !== nextProps.formSubmitted ||
      prevProps.showEmployeeError !== nextProps.showEmployeeError ||
      prevProps.showDepartmentError !== nextProps.showDepartmentError
    ) {
      return false;
    }

    const prevCondition = prevProps.condition;
    const nextCondition = nextProps.condition;

    if (
      prevProps.index !== nextProps.index ||
      prevCondition.id !== nextCondition.id ||
      prevCondition.type !== nextCondition.type
    ) {
      return false;
    }

    if (
      isDepartmentCondition(prevCondition) &&
      isDepartmentCondition(nextCondition)
    ) {
      if (
        prevCondition.departmentId !== nextCondition.departmentId ||
        prevCondition.role !== nextCondition.role
      ) {
        return false;
      }
    } else if (
      isEmployeeCondition(prevCondition) &&
      isEmployeeCondition(nextCondition)
    ) {
      if (!_.isEqual(prevCondition.employeeIds, nextCondition.employeeIds)) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
);

ConditionBlock.displayName = 'ConditionBlock';

export type ConditionGeneratorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export const ConditionGenerator: FC<ConditionGeneratorProps> = ({
  value,
  onChange
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions'
  });

  const watchConditions = watch('conditions');

  useEffect(() => {
    setFormSubmitted(false);
    setValidationErrors({});
  }, [fields.length]);

  useEffect(() => {
    if (!formSubmitted) return;

    const updatedErrors = { ...validationErrors };
    let hasChanges = false;

    watchConditions.forEach((condition, index) => {
      if (
        isEmployeeCondition(condition) &&
        condition.employeeIds.length > 0 &&
        validationErrors[`employee_${index}`]
      ) {
        delete updatedErrors[`employee_${index}`];
        hasChanges = true;
      }

      if (
        isDepartmentCondition(condition) &&
        condition.departmentId &&
        validationErrors[`department_${index}`]
      ) {
        delete updatedErrors[`department_${index}`];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setValidationErrors(updatedErrors);
    }
  }, [watchConditions, formSubmitted, validationErrors]);

  useEffect(() => {
    if (scrollContainerRef.current && fields.length > 0) {
      setTimeout(() => {
        const lastCondition = scrollContainerRef.current?.querySelector(
          '.space-y-4 > div:last-child'
        );
        if (lastCondition) {
          lastCondition.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, [fields.length]);

  useEffect(() => {
    if (value) {
      try {
        const parsedConditions: SubCondition[] = [];

        const conditionGroups = value.match(/\([^()]+\)/g) || [];

        conditionGroups.forEach((group, index) => {
          const groupContent = group.slice(1, -1);

          if (groupContent.includes('department =')) {
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
        reset({
          conditions: []
        });
      }
    } else {
      reset({
        conditions: []
      });
    }
  }, [value, reset]);

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

      return conditionParts.join(' || ');
    },
    []
  );

  const onSubmit = useCallback(
    (data: ConditionFormValues) => {
      let hasValidationErrors = false;

      data.conditions.forEach((condition, index) => {
        if (
          isEmployeeCondition(condition) &&
          condition.employeeIds.length === 0
        ) {
          hasValidationErrors = true;
          setValue(`conditions.${index}.employeeIds`, [], {
            shouldValidate: true
          });
        }

        if (isDepartmentCondition(condition) && !condition.departmentId) {
          hasValidationErrors = true;
          setValue(`conditions.${index}.departmentId`, '', {
            shouldValidate: true
          });
        }
      });

      if (!hasValidationErrors) {
        const conditionString = generateConditionString(data);
        onChange?.(conditionString);
        setFormSubmitted(false);
      }
    },
    [generateConditionString, onChange, setValue, setFormSubmitted]
  );

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

  const handleFormSubmit = useCallback(() => {
    setFormSubmitted(true);

    const newErrors: { [key: string]: boolean } = {};
    let hasErrors = false;

    watchConditions.forEach((condition, index) => {
      if (
        isEmployeeCondition(condition) &&
        condition.employeeIds.length === 0
      ) {
        newErrors[`employee_${index}`] = true;
        hasErrors = true;
      }

      if (isDepartmentCondition(condition) && !condition.departmentId) {
        newErrors[`department_${index}`] = true;
        hasErrors = true;
      }
    });

    setValidationErrors(newErrors);

    if (!hasErrors) {
      handleSubmit(onSubmit)();
    }
  }, [handleSubmit, onSubmit, watchConditions]);

  const clearError = useCallback(
    (type: 'department' | 'employee', index: number) => {
      setValidationErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[`${type}_${index}`];
        return updatedErrors;
      });
    },
    []
  );

  return (
    <div className="flex h-full max-h-[calc(100vh-250px)] flex-col">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth pr-1 pt-2"
      >
        <div className="space-y-4">
          {fields.map((field, index) => {
            const condition = watchConditions[index];

            if (!condition) return null;

            // Determine error states based on validation state
            const showEmployeeError =
              isEmployeeCondition(condition) &&
              validationErrors[`employee_${index}`] === true;

            const showDepartmentError =
              isDepartmentCondition(condition) &&
              validationErrors[`department_${index}`] === true;

            return (
              <ConditionBlock
                key={field.id}
                condition={condition}
                index={index}
                formErrors={errors as unknown as ConditionErrors}
                formSubmitted={formSubmitted}
                showEmployeeError={showEmployeeError}
                showDepartmentError={showDepartmentError}
                setValue={setValue}
                onRemove={handleRemoveCondition}
                clearError={clearError}
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
        {conditionString ? (
          <div className="bg-muted rounded p-2">
            <ConditionDisplay condition={conditionString} />
          </div>
        ) : (
          <div className="bg-muted rounded p-2 text-sm text-gray-500">
            Không có điều kiện
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          <details>
            <summary className="cursor-pointer">Xem chuỗi điều kiện</summary>
            <pre className="bg-muted/50 mt-1 overflow-auto rounded p-2">
              {conditionString || 'Không có điều kiện'}
            </pre>
          </details>
        </div>
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
