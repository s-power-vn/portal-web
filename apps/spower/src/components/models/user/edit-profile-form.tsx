import { useRouter } from '@tanstack/react-router';
import { object, string } from 'yup';

import { FC, useCallback, useRef } from 'react';

import { client } from '@storeo/core';
import {
  BusinessFormProps,
  Button,
  Form,
  TextField,
  closeModal,
  showModal,
  success
} from '@storeo/theme';

import { userApi } from '../../../api/user';
import { ChangePasswordForm } from './change-password-form';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email')
});

export type EditProfileFormProps = BusinessFormProps;

export const EditProfileForm: FC<EditProfileFormProps> = props => {
  const modalId = useRef<string | undefined>();
  const router = useRouter();

  const updateProfile = userApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa người dùng thành công');
      props.onSuccess?.();
    }
  });

  const onSuccessHandler = useCallback(async () => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleChangePassword = useCallback(() => {
    modalId.current = showModal({
      title: 'Đổi mật khẩu',
      className: 'w-[400px]',
      children: (
        <ChangePasswordForm
          onSuccess={onSuccessHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, []);

  return (
    <Form
      schema={schema}
      className={'flex flex-col gap-3'}
      defaultValues={{
        name: client.authStore.model?.name,
        email: client.authStore.model?.email
      }}
      onSubmit={values =>
        updateProfile.mutate({
          ...values,
          id: client.authStore.model?.id
        })
      }
      actions={
        <div className={'mt-6 flex justify-end gap-2'}>
          <Button
            type="reset"
            variant="destructive"
            onClick={handleChangePassword}
          >
            Đổi mật khẩu
          </Button>
          <Button
            type="reset"
            variant="secondary"
            onClick={() => router.history.back()}
          >
            Bỏ qua
          </Button>
          <Button type="submit">Chấp nhận</Button>
        </div>
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
    </Form>
  );
};
