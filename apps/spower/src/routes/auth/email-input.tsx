import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { api } from 'portal-api';
import { client2 } from 'portal-core';
import { object, string } from 'yup';

import {
  Button,
  Card,
  CardContent,
  Form,
  TextField,
  error
} from '@minhdtb/storeo-theme';

import { CommonLayout } from '../../layouts';

const schema = object().shape({
  email: string().email('Email không hợp lệ').required('Hãy nhập email')
});

export const Route = createFileRoute('/email-input')({
  component: EmailInput,
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

function EmailInput() {
  const navigate = useNavigate();
  const sendEmailOtp = api.user.sendEmailOtp.useMutation({
    onSuccess: (_, { email }) => {
      navigate({
        to: '/email-verify',
        search: { email }
      });
    },
    onError: () => {
      error('Gửi mã xác thực thất bại');
    }
  });

  const handleSubmit = ({ email }: { email: string }) => {
    sendEmailOtp.mutate({ email });
  };

  return (
    <CommonLayout>
      <Card className="border-none shadow-2xl">
        <CardContent className="w-[330px] p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate({ to: '/email-login' })}
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">Đăng ký</h1>
            <p className="text-sm text-gray-600">
              Nhập email của bạn để nhận mã xác thực
            </p>
          </div>
          <Form
            schema={schema}
            onSuccess={handleSubmit}
            loading={sendEmailOtp.isPending}
            defaultValues={{
              email: ''
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
              <TextField
                schema={schema}
                name="email"
                title="Email"
                options={{
                  className: 'rounded-lg'
                }}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </CommonLayout>
  );
}
