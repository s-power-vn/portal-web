import type { SearchSchemaInput } from '@tanstack/react-router';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { api } from 'portal-api';
import { client } from 'portal-core';
import { object, string } from 'yup';

import { cn } from '@minhdtb/storeo-core';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  PasswordField,
  TextField,
  error
} from '@minhdtb/storeo-theme';

import { CommonLayout } from '../layouts';

const Logo = () => (
  <img
    src={'http://s-power.vn/wp-content/uploads/2021/04/spower-non-bg-1.png'}
    className={`w-64 pb-4`}
    alt="logo"
  />
);

const schema = object().shape({
  email: string().email().required('Hãy nhập email'),
  password: string().required('Hãy nhập mật khẩu')
});

const Login = () => {
  const { redirect } = Route.useSearch();
  const router = useRouter();

  const login = api.auth.login.useMutation({
    onSuccess: () => router.history.push(redirect ?? '/'),
    onError: () => error('Tên đăng nhập hoặc mật khẩu không đúng')
  });

  return (
    <CommonLayout>
      <Card>
        <CardHeader></CardHeader>
        <CardContent className={'w-[330px]'}>
          <Form
            schema={schema}
            onSubmit={({ email, password }) =>
              login.mutate({ email, password })
            }
            defaultValues={{
              email: '',
              password: ''
            }}
            loading={login.isPending}
            className={'flex flex-col gap-4'}
            actions={
              <div
                className={'flex w-full items-center justify-center px-12 pt-4'}
              >
                {login.isPending ? (
                  <Button className={'w-full'} type={'button'}>
                    <Loader2
                      className={cn('my-1 h-6 w-6 animate-spin text-white')}
                    />
                  </Button>
                ) : (
                  <Button className={'w-full'} type={'submit'}>
                    Đăng nhập
                  </Button>
                )}
              </div>
            }
          >
            <Logo />
            <div className={'flex w-full items-center justify-center'}>
              <span className={'text-lg font-bold uppercase'}>Đăng nhập</span>
            </div>
            <TextField
              schema={schema}
              name={'email'}
              title={'Email'}
              options={{
                disabled: login.isPending
              }}
            />
            <PasswordField
              schema={schema}
              name={'password'}
              title={'Mật khẩu'}
              options={{
                disabled: login.isPending
              }}
            />
          </Form>
        </CardContent>
      </Card>
    </CommonLayout>
  );
};

export const loginSchema = object().shape({
  redirect: string().optional()
});

export const Route = createFileRoute('/login')({
  validateSearch: (input: unknown & SearchSchemaInput) =>
    loginSchema.validateSync(input),
  loaderDeps: ({ search }) => {
    return search;
  },
  component: () => {
    return <Login />;
  },
  beforeLoad: ({ location }) => {
    if (client.authStore.isValid) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      });
    }
  }
});
