import { AnyObject, ObjectSchema, object, string } from 'yup';

import { FC } from 'react';

import { ColumnTypeOptions } from '@storeo/core';
import {
  BusinessFormProps,
  Form,
  FormField,
  FormFieldProps,
  SelectInput,
  SelectInputProps,
  TextField,
  success
} from '@storeo/theme';

import { projectApi } from '../../../api';

const schema = object().shape({
  title: string().required('Hãy nhập tên cột'),
  type: string().required('Hãy chọn loại dữ liệu'),
  unit: string().required('Hãy nhập đơn vị')
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
  const addColumn = projectApi.addColumn.useMutation({
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
        type: '',
        unit: ''
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
      <TextField schema={schema} name={'unit'} title={'Đơn vị'} options={{}} />
    </Form>
  );
};