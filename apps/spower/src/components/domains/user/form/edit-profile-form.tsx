import { useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';
import { Collections, client, getImageUrl, getUser } from 'portal-core';
import { mixed, object, string } from 'yup';

import type { FC } from 'react';
import { useCallback } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import {
  Button,
  Form,
  TextField,
  showModal,
  success
} from '@minhdtb/storeo-theme';

import { ImageSelectField } from '../../../image/image-select-field';
import { ChangePasswordForm } from './change-password-form';

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  email: string().email('Sai định dạng email').required('Hãy nhập email'),
  avatar: mixed()
});

export type EditProfileFormProps = BusinessFormProps;

export const EditProfileForm: FC<EditProfileFormProps> = props => {
  const router = useRouter();
  const user = getUser();

  const updateProfile = api.user.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa người dùng thành công');
      props.onSuccess?.();
    }
  });

  const handleChangePassword = useCallback(() => {
    showModal({
      title: 'Đổi mật khẩu',
      className: 'w-[400px]',
      children: ({ close }) => {
        return <ChangePasswordForm onSuccess={close} onCancel={close} />;
      }
    });
  }, []);

  return (
    <Form
      schema={schema}
      className={'flex flex-col gap-3'}
      loading={updateProfile.isPending}
      defaultValues={{
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar
          ? getImageUrl(Collections.User, user?.id, user?.avatar)
          : ''
      }}
      onSubmit={values =>
        updateProfile.mutate({
          ...values,
          id: client.authStore.model?.id
        })
      }
      actions={methods => (
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
          <Button type="submit" disabled={!methods.formState.isDirty}>
            Chấp nhận
          </Button>
        </div>
      )}
    >
      <ImageSelectField
        schema={schema}
        name={'avatar'}
        title={'Ảnh đại diện'}
      />
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
