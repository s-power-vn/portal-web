import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { api } from 'portal-api';
import { client2 } from 'portal-core';
import { object, ref, string } from 'yup';

import { useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  Form,
  PasswordField,
  error,
  success
} from '@minhdtb/storeo-theme';

import { CommonLayout } from '../../layouts';

const searchSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Hãy nhập email')
});

const schema = object().shape({
  password: string()
    .required('Hãy nhập mật khẩu')
    .min(8, 'Mật khẩu dài ít nhất 8 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số')
    .matches(/[!@#$%^&*]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'),
  passwordConfirmation: string()
    .oneOf([ref('password'), undefined], 'Mật khẩu không trùng nhau')
    .required('Hãy xác nhận mật khẩu')
});

export const Route = createFileRoute('/password-input')({
  component: RouteComponent,
  validateSearch: input => searchSchema.validateSync(input),
  beforeLoad: async ({ location }) => {
    await client2.auth.authStateReady();
    if (client2.auth.currentUser) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      });
    }
  }
});

function RouteComponent() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const emailLogin = api.user.emailLogin.useMutation({
    onSuccess: () => {
      navigate({
        to: '/user-information',
        search: { email }
      });
    },
    onError: () => {
      error('Có lỗi xảy ra, vui lòng thử lại');
    }
  });

  const register = api.user.emailRegister.useMutation({
    onSuccess: () => {
      success('Tạo tài khoản thành công');
      emailLogin.mutate({ email, password });
    },
    onError: () => {
      error('Tạo tài khoản thất bại');
    }
  });

  const handleSubmit = ({
    password: submittedPassword
  }: {
    password: string;
  }) => {
    setPassword(submittedPassword);
    register.mutate({ email, password: submittedPassword });
  };

  return (
    <CommonLayout>
      <Card className="border-none shadow-2xl">
        <CardContent className="w-[330px] p-8">
          <div className="mb-6">
            <button
              onClick={() =>
                navigate({ to: '/email-verify', search: { email } })
              }
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              Tạo mật khẩu
            </h1>
            <p className="text-sm text-gray-600">
              Tạo mật khẩu cho tài khoản của bạn
            </p>
          </div>
          <Form
            schema={schema}
            onSuccess={handleSubmit}
            loading={register.isPending || emailLogin.isPending}
            defaultValues={{
              password: '',
              passwordConfirmation: ''
            }}
            className="flex flex-col gap-4"
            actions={
              <Button
                className="bg-appBlue hover:bg-appBlueLight mt-2 w-full py-3 font-medium text-white transition-colors"
                type="submit"
              >
                Tiếp tục
              </Button>
            }
          >
            <div className="space-y-4">
              <PasswordField
                schema={schema}
                name="password"
                title="Mật khẩu"
                options={{
                  className: 'rounded-lg',
                  autoComplete: 'new-password'
                }}
              />
              <PasswordField
                schema={schema}
                name="passwordConfirmation"
                title="Xác nhận mật khẩu"
                options={{
                  className: 'rounded-lg',
                  autoComplete: 'new-password'
                }}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </CommonLayout>
  );
}
