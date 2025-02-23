import { api } from 'portal-api';
import { client } from 'portal-core';
import { object, string } from 'yup';

import type { FC } from 'react';

import {
  BusinessFormProps,
  Form,
  TextField,
  error,
  success
} from '@minhdtb/storeo-theme';

const schema = object().shape({
  name: string().required('Tên quy trình là bắt buộc')
});

export type NewProcessFormProps = BusinessFormProps;

export const NewProcessForm: FC<NewProcessFormProps> = props => {
  const createProcess = api.process.create.useMutation({
    onSuccess: () => {
      success('Quy trình đã được tạo thành công');
      props.onSuccess?.();
    },
    onError: () => {
      error('Tạo quy trình thất bại');
    }
  });

  return (
    <Form
      schema={schema}
      {...props}
      onSuccess={values =>
        createProcess.mutate({
          ...values,
          createdBy: client.authStore.record?.id
        })
      }
      defaultValues={{
        name: ''
      }}
    >
      <TextField schema={schema} name={'name'} title={'Tên quy trình'} />
    </Form>
  );
};
