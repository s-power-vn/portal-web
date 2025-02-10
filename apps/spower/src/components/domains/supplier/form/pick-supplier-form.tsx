import { array, object, string } from 'yup';

import { FC } from 'react';

import { BusinessFormProps, Form } from '@minhdtb/storeo-theme';

import { SupplierDropdownField } from '../field/supplier-dropdown-field';

const schema = object({
  supplier: array().of(string()).min(1, 'Hãy chọn nhà cung cấp')
});

export type PickSupplierFormProps = BusinessFormProps;

export const PickSupplierForm: FC<PickSupplierFormProps> = ({
  onSuccess,
  onCancel
}) => {
  return (
    <Form
      schema={schema}
      onSubmit={onSuccess}
      onCancel={onCancel}
      className={'flex flex-col gap-3'}
      defaultValues={{
        supplier: []
      }}
    >
      <SupplierDropdownField
        schema={schema}
        name={'supplier'}
        title={'Nhà cung cấp'}
      />
    </Form>
  );
};
