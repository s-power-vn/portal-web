import { object, string } from 'yup';

import { FC } from 'react';

import { client } from '@storeo/core';
import {
  BusinessFormProps,
  Button,
  Form,
  TextField,
  success
} from '@storeo/theme';

import { userApi } from '../../../api/user';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email')
});

export type EditProfileFormProps = BusinessFormProps;

export const EditProfileForm: FC<EditProfileFormProps> = props => {
  const updateProfile = userApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa người dùng thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      className={'flex flex-col gap-3'}
      defaultValues={{
        name: client.authStore.model?.name,
        email: client.authStore.model?.email
      }}
      showButtons={false}
      onSubmit={values =>
        updateProfile.mutate({
          ...values,
          id: client.authStore.model?.id
        })
      }
    >
      <TextField schema={schema} name="name" title="Họ tên" />
      <TextField
        schema={schema}
        name="email"
        title="Email"
        options={{
          disabled: true
        }}
      />
      <div className={'mt-6 flex justify-end gap-2'}>
        <Button type="reset" variant="destructive">
          Đổi mật khẩu
        </Button>
        <Button type="reset" variant="secondary">
          Bỏ qua
        </Button>
        <Button type="submit">Chấp nhận</Button>
      </div>
    </Form>
  );
};
