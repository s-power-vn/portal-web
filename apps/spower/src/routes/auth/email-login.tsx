import type { SearchSchemaInput } from '@tanstack/react-router';
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter
} from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { api } from 'portal-api';
import { client2 } from 'portal-core';
import { object, string } from 'yup';

import {
  Button,
  Card,
  CardContent,
  Form,
  PasswordField,
  TextField,
  error
} from '@minhdtb/storeo-theme';

import { CommonLayout } from '../../layouts';

const schema = object().shape({
  email: string().email().required('Hãy nhập email'),
  password: string().required('Hãy nhập mật khẩu')
});

export const Route = createFileRoute('/email-login')({
  validateSearch: (input: unknown & SearchSchemaInput) =>
    loginSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return search;
  },
  component: EmailLogin,
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

function EmailLogin() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();

  const login = api.user.emailLogin.useMutation({
    onSuccess: () => router.history.push(redirect ?? '/'),
    onError: () => error('Tên đăng nhập hoặc mật khẩu không đúng')
  });

  return (
    <CommonLayout>
      <Card className="border-none shadow-2xl">
        <CardContent className="w-[330px] p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate({ to: '/signin' })}
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">Đăng nhập</h1>
            <p className="text-sm text-gray-600">
              Đăng nhập bằng email và mật khẩu
            </p>
          </div>
          <Form
            schema={schema}
            onSuccess={({ email, password }) =>
              login.mutate({ email, password })
            }
            defaultValues={{
              email: '',
              password: ''
            }}
            className="flex flex-col gap-4"
            actions={
              <Button
                className="bg-appBlue hover:bg-appBlueLight mt-2 w-full py-3 font-medium text-white transition-colors"
                type="submit"
              >
                Đăng nhập
              </Button>
            }
            loading={login.isPending}
          >
            <div className="space-y-4">
              <TextField
                schema={schema}
                name="email"
                title="Email"
                options={{
                  disabled: login.isPending,
                  className: 'rounded-lg'
                }}
              />
              <PasswordField
                schema={schema}
                name="password"
                title="Mật khẩu"
                options={{
                  disabled: login.isPending,
                  className: 'rounded-lg'
                }}
              />
            </div>
          </Form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate({ to: '/email-input' })}
              className="text-appBlue inline-flex items-center gap-1 text-sm font-medium transition-all hover:text-blue-700 hover:underline"
            >
              Chưa có tài khoản?{' '}
              <span className="font-semibold">Đăng ký ngay</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </CommonLayout>
  );
}

export const loginSchema = object().shape({
  redirect: string().optional()
});
