import { createFileRoute, redirect } from '@tanstack/react-router';
import { object, string } from 'yup';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  PasswordField,
  TextField
} from '@storeo/theme';

import { useLogin } from '../api';
import { CommonLayout } from '../layouts';

export const Logo = () => (
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
  const login = useLogin(redirect);

  return (
    <CommonLayout>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
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
          >
            <Logo />
            <div className={'flex w-full items-center justify-center'}>
              <span className={'text-lg font-bold uppercase'}>Đăng nhập</span>
            </div>
            <TextField schema={schema} name={'email'} title={'Email'} />
            <PasswordField
              schema={schema}
              name={'password'}
              title={'Mật khẩu'}
            />
            <div
              className={'flex w-full items-center justify-center px-12 pt-4'}
            >
              <Button className={'w-full'} type={'submit'}>
                Đăng nhập
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </CommonLayout>
  );
};

export const Route = createFileRoute('/login')({
  component: () => {
    return <Login />;
  },
  beforeLoad: ({ context, location }) => {
    if (context.pb?.authStore.isValid) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      });
    }
  },
  loaderDeps: ({ search }: { search: { redirect: string } }) => {
    return search;
  }
});
