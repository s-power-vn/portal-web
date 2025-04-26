import { organizationApi } from 'portal-api';
import { object, string } from 'yup';

import { FC } from 'react';

import {
  BusinessFormProps,
  Form,
  TextField,
  success
} from '@minhdtb/storeo-theme';

const schema = object().shape({
  name: string().required('Tên tổ chức là bắt buộc')
});

export type NewOrganizationFormProps = BusinessFormProps;

export const NewOrganizationForm: FC<NewOrganizationFormProps> = props => {
  const createOrganization = organizationApi.create.useMutation({
    onSuccess: () => {
      success('Tạo tổ chức thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values => {
        createOrganization.mutate(values);
      }}
      onCancel={props.onCancel}
      defaultValues={{
        name: ''
      }}
      loading={createOrganization.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <TextField schema={schema} name="name" title="Tên tổ chức" />
    </Form>
  );
};
