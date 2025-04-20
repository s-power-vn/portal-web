import {
  ParsedLocation,
  createFileRoute,
  redirect,
  useNavigate
} from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { api } from 'portal-api';
import { currentUserEmail } from 'portal-core';

import { Button, Card, CardContent } from '@minhdtb/storeo-theme';

import { CommonLayout } from '../../layouts';
import { RouteContext } from '../root';
import { enhancedWaitAuthenticated } from './auth-cache';

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
  beforeLoad: goRootRoute
});

function RouteComponent() {
  const navigate = useNavigate();

  const googleLogin = api.user.googleLogin.useMutation({
    onSuccess: () => {
      navigate({
        to: '/'
      });
    }
  });

  return (
    <CommonLayout>
      <Card className="border-none shadow-2xl">
        <CardContent className="w-[330px] p-8">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-800">Đăng nhập</h1>
            <p className="text-sm text-gray-600">Chọn phương thức đăng nhập</p>
          </div>
          <div className="flex flex-col gap-3">
            {/* Email/Password Button */}
            <Button
              onClick={() =>
                navigate({
                  to: '/email-login'
                })
              }
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-md"
            >
              <Mail className="text-appBlue h-5 w-5" />
              <span>Email</span>
            </Button>

            {/* Google Button */}
            <Button
              onClick={() => googleLogin.mutate()}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-md"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google</span>
            </Button>

            {/* Facebook Button */}
            <Button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-md">
              <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </Button>

            {/* Apple Button */}
            <Button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-md">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.94-3.08.47-1.08-.48-2.07-.48-3.21 0-1.44.62-2.2.44-3.08-.47C2.7 15.25 3.27 7.32 9.32 7c1.41.07 2.38.95 3.12.95.74 0 2.12-.9 3.67-.9 1.43.01 2.74.54 3.76 1.53-3.35 2.18-2.81 6.72 1.05 8.42-.85 2.46-2.35 3.86-3.87 4.28zM15.33 6.43c.77-.93 1.35-2.22 1.14-3.53-1.11.07-2.41.75-3.17 1.68-.69.8-1.32 2.08-1.15 3.38 1.23.09 2.48-.69 3.18-1.53z" />
              </svg>
              <span>Apple</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </CommonLayout>
  );
}

export async function goRootRoute({
  location
}: {
  context: RouteContext;
  location: ParsedLocation;
}) {
  const authResult = await enhancedWaitAuthenticated();

  if (authResult.status === 'not-registered') {
    localStorage.removeItem('organizationId');
    throw redirect({
      to: '/user-information',
      search: {
        email: currentUserEmail.value ?? ''
      }
    });
  }

  if (authResult.status === 'authorized') {
    throw redirect({
      to: '/',
      search: {
        redirect: location.href
      }
    });
  }
}
