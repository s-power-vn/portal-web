import * as yup from 'yup';

import { useCallback, useState } from 'react';

import {
  ExpressionRowData,
  ExpressionRowErrors,
  PropertyVariable
} from '../types';
import { createEmptyRow, parseCondition } from '../utils';

export const useExpressionParser = (
  value: string,
  objectType: string,
  variables: PropertyVariable[]
) => {
  const [rows, setRows] = useState<ExpressionRowData[]>(() =>
    value ? parseCondition(value, objectType, variables) : [createEmptyRow()]
  );

  const [errors, setErrors] = useState<Record<string, ExpressionRowErrors>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateRow = useCallback(async (row: ExpressionRowData) => {
    try {
      await yup
        .object<ExpressionRowData>({
          property: yup.string().required('Thuộc tính là bắt buộc'),
          propertyType: yup.string().when('property', {
            is: (property: string) => !!property,
            then: schema => schema.required('Loại thuộc tính là bắt buộc'),
            otherwise: schema => schema
          }),
          operator: yup.string().required('Toán tử là bắt buộc'),
          value: yup
            .mixed()
            .when(['operator', 'propertyType'], ([operator, propertyType]) => {
              if (operator === 'in') {
                if (propertyType === 'datetime') {
                  return yup.mixed().nullable();
                }
                if (propertyType === 'employee') {
                  return yup
                    .array()
                    .of(yup.string())
                    .required('Giá trị là bắt buộc');
                }
              }
              return yup.string().required('Giá trị là bắt buộc');
            }),
          fromDate: yup
            .date()
            .nullable()
            .when(['operator', 'propertyType'], {
              is: (operator: string, propertyType: string) =>
                operator === 'in' && propertyType === 'datetime',
              then: schema => schema.required('Từ ngày là bắt buộc'),
              otherwise: schema => schema.nullable()
            }),
          toDate: yup
            .date()
            .nullable()
            .when(['operator', 'propertyType', 'fromDate'], {
              is: (
                operator: string,
                propertyType: string,
                fromDate: Date | null
              ) => operator === 'in' && propertyType === 'datetime' && fromDate,
              then: schema =>
                schema
                  .required('Đến ngày là bắt buộc')
                  .min(yup.ref('fromDate'), 'Đến ngày phải lớn hơn Từ ngày'),
              otherwise: schema => schema.nullable()
            })
        })
        .validate(row, { abortEarly: false });

      setErrors(prev => ({ ...prev, [row.id]: {} }));
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: ExpressionRowErrors = {};
        err.inner.forEach(e => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
        setErrors(prev => ({ ...prev, [row.id]: fieldErrors }));
      }
      return false;
    }
  }, []);

  const handleUpdateRow = useCallback(
    (id: string, field: keyof ExpressionRowData, value: any) => {
      setRows(prevRows => {
        const newRows = prevRows.map(row => {
          if (row.id === id) {
            const updatedRow = { ...row, [field]: value };

            // Reset operator and value when property changes
            if (field === 'property') {
              updatedRow.operator = '';
              updatedRow.value = null;
              updatedRow.fromDate = null;
              updatedRow.toDate = null;
            }

            // Reset value when operator changes
            if (field === 'operator') {
              updatedRow.value = null;
              updatedRow.fromDate = null;
              updatedRow.toDate = null;
            }

            // Reset toDate if fromDate is after it
            if (
              field === 'fromDate' &&
              updatedRow.toDate &&
              updatedRow.fromDate &&
              updatedRow.fromDate > updatedRow.toDate
            ) {
              updatedRow.toDate = null;
            }

            // Convert comma-separated string to array for employee IN
            if (
              field === 'value' &&
              updatedRow.propertyType === 'employee' &&
              updatedRow.operator === 'in' &&
              typeof value === 'string'
            ) {
              updatedRow.value = value.split(',').map(v => v.trim());
            }

            // Validate the updated row if already submitted
            if (isSubmitted) {
              validateRow(updatedRow).catch(console.error);
            }

            return updatedRow;
          }
          return row;
        });

        return newRows;
      });
    },
    [validateRow, isSubmitted]
  );

  const handleAddRow = useCallback(() => {
    const newRow = createEmptyRow();
    setRows(prevRows => [...prevRows, newRow]);
    setErrors(prev => ({ ...prev, [newRow.id]: {} }));
  }, []);

  const handleRemoveRow = useCallback((id: string) => {
    setRows(prevRows => {
      const newRows = prevRows.filter(row => row.id !== id);
      return newRows.length > 0 ? newRows : [createEmptyRow()];
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  }, []);

  const validateAllRows = useCallback(async () => {
    setIsSubmitted(true);
    const validations = await Promise.all(rows.map(validateRow));
    return validations.every(Boolean);
  }, [rows, validateRow]);

  return {
    rows,
    errors: isSubmitted ? errors : {},
    handleUpdateRow,
    handleAddRow,
    handleRemoveRow,
    validateAllRows
  };
};
