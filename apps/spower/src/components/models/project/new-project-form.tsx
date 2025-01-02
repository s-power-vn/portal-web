import {
  BusinessFormProps,
  Form,
  TextField,
  success
} from '@minhdtb/storeo-theme';
import { object, string } from 'yup';

import { FC } from 'react';

import { projectApi } from '../../../api';
import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

export type NewProjectFormProps = BusinessFormProps;

export const NewProjectForm: FC<NewProjectFormProps> = props => {
  const createProject = projectApi.create.useMutation({
    onSuccess: async () => {
      success('Tạo dự án thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values => createProject.mutate(values)}
      defaultValues={{
        name: '',
        bidding: '',
        customer: ''
      }}
      onCancel={props.onCancel}
      loading={createProject.isPending}
      className={'flex w-[480px] flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'name'}
        title={'Tên công trình'}
        options={{}}
      />
      <TextField
        schema={schema}
        name={'bidding'}
        title={'Tên gói thầu'}
        options={{}}
      />
      <CustomerDropdownField
        schema={schema}
        name={'customer'}
        title={'Chủ đầu tư'}
        options={{
          placeholder: 'Hãy chọn chủ đầu tư'
        }}
      />
    </Form>
  );
};
