import {
  BusinessFormProps,
  Form,
  TextField,
  error,
  success
} from '@minhdtb/storeo-theme';
import { client } from 'portal-core';
import { object, ref, string } from 'yup';

import { FC } from 'react';

import { userApi } from '../../../api/user';

const schema = object().shape({
  oldPassword: string().required('Hãy nhập mật khẩu hiện tại'),
  newPassword: string()
    .required('Hãy nhập mật khẩu mới')
    .min(8, 'Mật khẩu dài ít nhất 8 ký tự'),
  newPasswordConfirmation: string()
    .oneOf([ref('newPassword'), undefined], 'Mật khẩu mới không trùng nhau')
    .required('Hãy nhập lại mật khẩu mới')
});

export type ChangePasswordFormProps = BusinessFormProps;

export const ChangePasswordForm: FC<ChangePasswordFormProps> = props => {
  const changePassword = userApi.changePassword.useMutation({
    onError: err => {
      error(err.message);
    },
    onSuccess: async () => {
      success('Đổi mật khẩu thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      className={'flex flex-col gap-3'}
      defaultValues={{
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmation: ''
      }}
      onCancel={props.onCancel}
      onSubmit={values =>
        changePassword.mutate({
          ...values,
          id: client.authStore.model?.id
        })
      }
    >
      <TextField
        schema={schema}
        name="oldPassword"
        title="Mật khẩu hiện tại"
        options={{
          type: 'password',
          autoComplete: 'new-password'
        }}
      />
      <TextField
        schema={schema}
        name="newPassword"
        title="Mật khẩu mới"
        options={{
          type: 'password',
          autoComplete: 'new-password'
        }}
      />
      <TextField
        schema={schema}
        name="newPasswordConfirmation"
        title="Nhập lại mật khẩu mới"
        options={{
          type: 'password',
          autoComplete: 'new-password'
        }}
      />
    </Form>
  );
};
