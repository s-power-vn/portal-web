import { Link } from '@tanstack/react-router';
import { AlertCircle, Home } from 'lucide-react';

import { FC } from 'react';

import { Button } from '@minhdtb/storeo-theme';

export type ErrorProps = {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
};

export const Error: FC<ErrorProps> = ({
  title = 'Đã xảy ra lỗi',
  message = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
  showHomeButton = true
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-gray-600">{message}</p>
        </div>
        {showHomeButton && (
          <Button asChild variant="outline" className="mt-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
