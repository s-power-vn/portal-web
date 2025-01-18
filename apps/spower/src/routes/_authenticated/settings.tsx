import { createFileRoute } from '@tanstack/react-router';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { api } from 'portal-api';

import { useCallback } from 'react';

import { For } from '@minhdtb/storeo-core';
import { Button, showModal, success, useConfirm } from '@minhdtb/storeo-theme';

import {
  AddApproverForm,
  AddConfirmerForm,
  PageHeader
} from '../../components';
import { useInvalidateQueries } from '../../hooks';

const Component = () => {
  const invalidates = useInvalidateQueries();
  const listConfirmer = api.setting.listConfirmer.useSuspenseQuery();

  const deleteConfirmer = api.setting.deleteConfirmer.useMutation({
    onSuccess: async () => {
      success('Xóa người xác nhận thành công');
      await invalidates([api.setting.listConfirmer.getKey()]);
    }
  });

  const listApprover = api.setting.listApprover.useSuspenseQuery();

  const deleteApprover = api.setting.deleteApprover.useMutation({
    onSuccess: async () => {
      success('Xóa người phê duyệt thành công');
      await invalidates([api.setting.listApprover.getKey()]);
    }
  });

  const { confirm } = useConfirm();

  const handleAddConfirmer = useCallback(() => {
    showModal({
      title: 'Thêm người xác nhận',
      className: 'w-80',
      children: ({ close }) => (
        <AddConfirmerForm
          onSuccess={() => {
            invalidates([api.setting.listConfirmer.getKey()]);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [invalidates]);

  const handleAddApprover = useCallback(() => {
    showModal({
      title: 'Thêm người phê duyệt',
      className: 'w-80',
      children: ({ close }) => (
        <AddApproverForm
          onSuccess={() => {
            invalidates([api.setting.listApprover.getKey()]);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [invalidates]);

  return (
    <>
      <PageHeader title={'Cài đặt'} />
      <div className={'flex w-1/2 flex-col gap-2 p-2'}>
        <div className={'flex flex-col gap-2 p-1'}>
          <div className={'text-appBlue flex items-center gap-2'}>
            Người xác nhận
            <Button className={'h-6 w-6 p-0'} onClick={handleAddConfirmer}>
              <PlusIcon className={'h-3 w-3'} />
            </Button>
          </div>
          <div className={'flex flex-col gap-1 rounded-lg border p-2'}>
            <For
              each={listConfirmer.data ?? []}
              fallback={
                <div className={'text-appGray text-sm'}>
                  Chưa có người xác nhận nào
                </div>
              }
            >
              {item => (
                <div
                  className={'flex items-center gap-2 p-1 text-sm'}
                  key={item.id}
                >
                  {item.expand.user.name}
                  <Button
                    className={'bg-appError h-4 w-4 p-0 '}
                    onClick={() => {
                      confirm(
                        'Bạn có chắc muốn xóa người xác nhận này?',
                        () => {
                          deleteConfirmer.mutate(item.id);
                        }
                      );
                    }}
                  >
                    <MinusIcon className={'h-2 w-2'} />
                  </Button>
                </div>
              )}
            </For>
          </div>
        </div>
        <div className={'flex flex-col gap-2 p-1'}>
          <div className={'text-appBlue flex items-center gap-2'}>
            Người duyệt
            <Button className={'h-6 w-6 p-0'} onClick={handleAddApprover}>
              <PlusIcon className={'h-3 w-3'} />
            </Button>
          </div>
          <div className={'flex flex-col gap-1 rounded-lg border p-2'}>
            <For
              each={listApprover.data ?? []}
              fallback={
                <div className={'text-appGray text-sm'}>
                  Chưa có người phê duyệt nào
                </div>
              }
            >
              {item => (
                <div
                  className={'flex items-center gap-2 p-1 text-sm'}
                  key={item.id}
                >
                  {item.expand.user.name}
                  <Button
                    className={'bg-appError h-4 w-4 p-0'}
                    onClick={() => {
                      confirm(
                        'Bạn có chắc muốn xóa người phê duyệt này?',
                        () => {
                          deleteApprover.mutate(item.id);
                        }
                      );
                    }}
                  >
                    <MinusIcon className={'h-2 w-2'} />
                  </Button>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_authenticated/settings')({
  component: Component,
  beforeLoad: () => ({ title: 'Cài đặt' }),
  loader: ({ context: { queryClient } }) =>
    queryClient?.ensureQueryData(api.setting.listConfirmer.getOptions())
});
