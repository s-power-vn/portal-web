import { api } from 'portal-api';
import type { ColumnTypeOptions } from 'portal-core';
import type { AnyObject, ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { FC } from 'react';

import type {
  BusinessFormProps,
  FormFieldProps,
  SelectInputProps
} from '@minhdtb/storeo-theme';
import {
  Form,
  FormField,
  SelectInput,
  TextField,
  success
} from '@minhdtb/storeo-theme';

const schema = object().shape({
  title: string().required('Hãy nhập tên cột'),
  type: string().required('Hãy chọn loại dữ liệu')
});

export type NewColumnFormProps = BusinessFormProps & {
  projectId: string;
};

type ColumnTypeDropdownProps = Omit<SelectInputProps, 'items'>;
const ColumnTypeDropdown: FC<ColumnTypeDropdownProps> = props => {
  return (
    <SelectInput
      items={[
        { value: 'Text', label: 'Chữ' },
        { value: 'Numeric', label: 'Số' }
      ]}
      {...props}
    />
  );
};

export type ColumnTypeDropdownFieldProps<S extends ObjectSchema<AnyObject>> =
  FormFieldProps<ColumnTypeDropdownProps, S>;

export const ColumnTypeDropdownField = <S extends ObjectSchema<AnyObject>>({
  options,
  ...props
}: ColumnTypeDropdownFieldProps<S>) => {
  return (
    <FormField {...props}>
      <ColumnTypeDropdown {...options} />
    </FormField>
  );
};

export const NewColumnForm: FC<NewColumnFormProps> = props => {
  const addColumn = api.project.addColumn.useMutation({
    onSuccess: async () => {
      success('Thêm cột thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        addColumn.mutate({
          ...values,
          type: values.type as ColumnTypeOptions,
          project: props.projectId
        })
      }
      defaultValues={{
        title: '',
        type: ''
      }}
      onCancel={props.onCancel}
      loading={addColumn.isPending}
      className={'flex flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'title'}
        title={'Tên cột'}
        options={{}}
      />
      <ColumnTypeDropdownField
        schema={schema}
        name={'type'}
        title={'Loại dữ liệu'}
        options={{}}
      />
    </Form>
  );
};
