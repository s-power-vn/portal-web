import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { api } from 'portal-api';

import { useCallback } from 'react';

import { Button } from '@minhdtb/storeo-theme';

import { PageHeader } from '../../../components';

export const Route = createFileRoute('/_authenticated/settings/process')({
  component: RouteComponent,
  beforeLoad: () => ({ title: 'Quản lý quy trình' })
});

function RouteComponent() {
  const { data: process } = api.process.listFull.useSuspenseQuery();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleAddProcess = useCallback(() => {
    navigate({
      to: './new'
    });
  }, [navigate]);

  return (
    <>
      <Outlet />
      <PageHeader title={'Quản lý quy trình'} />
      <div className={'flex flex-col gap-2 p-2'}>
        <div className={'flex gap-2'}>
          <Button onClick={handleAddProcess}>
            <PlusIcon className={'h-5 w-5'} />
            Thêm quy trình
          </Button>
        </div>
      </div>
    </>
  );
}
