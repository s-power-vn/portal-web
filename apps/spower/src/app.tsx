import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ErrorComponentProps,
  RouterProvider,
  createRouter,
  parseSearchWith,
  stringifySearchWith
} from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { parse, stringify } from 'zipson';

import { createContext } from 'react';

import { ModalProvider, error } from '@minhdtb/storeo-theme';

import { Error } from './components/error';
import { ErrorBoundary } from './components/error-boundary';
import { useAuth } from './hooks/useAuth';
import { routeTree } from './routes.gen';

function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Buffer.from(str, 'base64')
      .toString()
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

function encodeToBinary(str: string): string {
  return Buffer.from(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  ).toString('base64');
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (err: Error) => {
        error(err.message);
      }
    }
  }
});

const AuthContext = createContext<{
  status: 'authorized' | 'unauthorized' | 'not-registered';
  user_id: string;
  token: string;
}>({
  status: 'unauthorized',
  user_id: '',
  token: ''
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuth();

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: {
      status: 'unauthorized',
      user_id: '',
      user_email: '',
      token: '',
      isLoading: false
    }
  },
  defaultPendingComponent: () => (
    <div className={`p-2`}>
      <Loader className={'h-6 w-6 animate-spin'} />
    </div>
  ),
  defaultNotFoundComponent: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <Error
        title="404 - Không tìm thấy trang"
        message="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
      />
    </div>
  ),
  defaultErrorComponent: (props: ErrorComponentProps) => (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <Error
        title="Lỗi"
        message={
          props.error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
        }
      />
    </div>
  ),
  defaultPreload: 'intent',
  parseSearch: parseSearchWith(value => parse(decodeFromBinary(value))),
  stringifySearch: stringifySearchWith(value =>
    encodeToBinary(stringify(value))
  )
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const MyApp = () => {
  const { data } = useAuth();

  return <RouterProvider router={router} context={{ auth: data }} />;
};

export const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <MyApp />
        </ModalProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
