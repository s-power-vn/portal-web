import {
  createFileRoute,
  useNavigate,
  useRouter
} from '@tanstack/react-router';
import { api } from 'portal-api';
import { object, string } from 'yup';

import {
  Button,
  Card,
  CardContent,
  Form,
  TextField,
  error,
  success
} from '@minhdtb/storeo-theme';

import { CommonLayout } from '../../layouts';
import { forceRefreshAuth } from './auth-cache';

const searchSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Hãy nhập email')
});

const schema = object().shape({
  name: string().required('Hãy nhập họ tên'),
  phone: string(),
  address: string()
});

export const Route = createFileRoute('/user-information')({
  component: RouteComponent,
  validateSearch: input => searchSchema.validateSync(input)
});

function RouteComponent() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();

  const registerUserInformation = api.user.registerUserInformation.useMutation({
    onSuccess: () => {
      success('Đăng ký thông tin thành công');
      forceRefreshAuth();
      router.invalidate();
      navigate({ to: '/' });
    },
    onError: () => {
      error('Có lỗi xảy ra khi đăng ký thông tin');
    }
  });

  const handleSubmit = (values: {
    name: string;
    phone?: string;
    address?: string;
  }) => {
    registerUserInformation.mutate({
      email,
      name: values.name,
      phone: values.phone,
      address: values.address
    });
  };

  return (
    <CommonLayout>
      <Card className="border-none shadow-2xl">
        <CardContent className="w-[330px] p-8">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              Thông tin cá nhân
            </h1>
            <p className="text-sm text-gray-600">
              Vui lòng điền thông tin cá nhân của bạn
            </p>
            <p className="mt-2 text-sm text-gray-500">Email: {email}</p>
          </div>
          <Form
            schema={schema}
            onSuccess={handleSubmit}
            loading={registerUserInformation.isPending}
            defaultValues={{
              name: '',
              phone: '',
              address: ''
            }}
            className="flex flex-col gap-4"
            actions={
              <Button
                className="bg-appBlue hover:bg-appBlueLight mt-2 w-full py-3 font-medium text-white transition-colors"
                type="submit"
              >
                Đăng ký
              </Button>
            }
          >
            <div className="space-y-4">
              <TextField
                schema={schema}
                name="name"
                title="Họ tên"
                options={{
                  className: 'rounded-lg'
                }}
              />
              <TextField
                schema={schema}
                name="phone"
                title="Số điện thoại"
                options={{
                  className: 'rounded-lg'
                }}
              />
              <TextField
                schema={schema}
                name="address"
                title="Địa chỉ"
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
