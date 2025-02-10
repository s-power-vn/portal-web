import { array, object, string } from 'yup';

import { FC } from 'react';

import { BusinessFormProps, Form } from '@minhdtb/storeo-theme';

import { SupplierDropdownField } from '../field/supplier-dropdown-field';

const schema = object({
  suppliers: array().of(string()).min(1, 'Hãy chọn nhà cung cấp')
});

export type PickSuppliersFormProps = BusinessFormProps & {
  initialSuppliers?: string[];
};

export const PickSuppliersForm: FC<PickSuppliersFormProps> = ({
  onSuccess,
  onCancel,
  initialSuppliers
}) => {
  return (
    <Form
      schema={schema}
      onSubmit={onSuccess}
      onCancel={onCancel}
      className={'flex flex-col gap-3'}
      defaultValues={{
        suppliers: initialSuppliers ?? []
      }}
    >
      <SupplierDropdownField
        schema={schema}
        name={'suppliers'}
        title={'Nhà cung cấp'}
      />
    </Form>
  );
};
