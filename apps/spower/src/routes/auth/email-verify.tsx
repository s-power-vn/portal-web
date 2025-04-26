import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { userApi } from 'portal-api';
import { object, string } from 'yup';

import {
  Button,
  Card,
  CardContent,
  Form,
  NumericField,
  error,
  success
} from '@minhdtb/storeo-theme';

import { CommonLayout } from '../../layouts';
import { goRootRoute } from './signin';

const searchSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Hãy nhập email')
});

const schema = object().shape({
  code: string()
    .required('Hãy nhập mã xác thực')
    .matches(/^\d{6}$/, 'Mã xác thực phải có 6 chữ số')
});

export const Route = createFileRoute('/email-verify')({
  component: EmailVerify,
  validateSearch: input => searchSchema.validateSync(input),
  beforeLoad: goRootRoute
});

function EmailVerify() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const verifyEmailOtp = userApi.verifyEmailOtp.useMutation({
    onSuccess: () => {
      success('Xác thực email thành công');
      navigate({ to: '/password-input', search: { email } });
    },
    onError: () => {
      error('Mã xác thực không đúng');
    }
  });

  const handleSubmit = ({ code }: { code: string }) => {
    verifyEmailOtp.mutate({ email, code });
  };

  return (
    <CommonLayout>
      <Card className="border-none shadow-2xl">
        <CardContent className="w-[330px] p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate({ to: '/email-input' })}
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              Xác thực email
            </h1>
            <p className="text-sm text-gray-600">
              Nhập mã xác thực đã được gửi đến email của bạn
            </p>
          </div>
          <Form
            schema={schema}
            onSuccess={handleSubmit}
            loading={verifyEmailOtp.isPending}
            defaultValues={{
              code: ''
            }}
            className="flex flex-col gap-4"
            actions={
              <Button
                className="bg-appBlue hover:bg-appBlueLight mt-2 w-full py-3 font-medium text-white transition-colors"
                type="submit"
              >
                Xác nhận
              </Button>
            }
          >
            <div className="space-y-4">
              <NumericField
                schema={schema}
                name="code"
                title="Mã xác thực"
                options={{
                  className: 'rounded-lg',
                  maxLength: 6
                }}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </CommonLayout>
  );
}
