import { PlusCircle } from 'lucide-react';
import { objectApi } from 'portal-api';

import { FC, useCallback } from 'react';

import { Button } from '@minhdtb/storeo-theme';

import { ExpressionRow } from './expression-row';
import { useExpressionParser } from './hooks/use-expression-parser';
import { ExpressionEditorProps, PropertyVariable } from './types';
import { expressionsToCondition } from './utils';

export const ExpressionEditor: FC<ExpressionEditorProps> = ({
  objectType,
  value = '',
  onSubmit,
  onClose
}) => {
  const listVariables = objectApi.getVariables.useSuspenseQuery({
    variables: objectType
  });

  const {
    rows,
    errors,
    handleUpdateRow,
    handleAddRow,
    handleRemoveRow,
    validateAllRows
  } = useExpressionParser(
    value,
    objectType,
    listVariables.data as PropertyVariable[]
  );

  const handleSubmit = useCallback(async () => {
    const isValid = await validateAllRows();
    if (isValid) {
      const condition = expressionsToCondition(rows, objectType);
      onSubmit(condition);
    }
  }, [rows, objectType, onSubmit, validateAllRows]);

  return (
    <div className="flex h-[400px] flex-col gap-1">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <ExpressionRow
              key={row.id}
              row={row}
              variables={listVariables.data as PropertyVariable[]}
              errors={errors[row.id]}
              onUpdate={handleUpdateRow}
              onRemove={handleRemoveRow}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Button onClick={handleAddRow}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm biểu thức
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
};
