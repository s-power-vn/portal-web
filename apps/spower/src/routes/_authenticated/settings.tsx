import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { useCallback, useRef } from 'react';

import { For } from '@storeo/core';
import {
  Button,
  closeModal,
  showModal,
  success,
  useConfirm
} from '@storeo/theme';

import { settingApi } from '../../api';
import {
  AddApproverForm,
  AddConfirmerForm,
  PageHeader
} from '../../components';

const Component = () => {
  const modalId = useRef<string | undefined>();

  const queryClient = useQueryClient();

  const listConfirmer = settingApi.listConfirmer.useSuspenseQuery();

  const deleteConfirmer = settingApi.deleteConfirmer.useMutation({
    onSuccess: async () => {
      success('Xóa người xác nhận thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: settingApi.listConfirmer.getKey()
        })
      ]);
    }
  });

  const listApprover = settingApi.listApprover.useSuspenseQuery();

  const deleteApprover = settingApi.deleteApprover.useMutation({
    onSuccess: async () => {
      success('Xóa người phê duyệt thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: settingApi.listApprover.getKey()
        })
      ]);
    }
  });

  const { confirm } = useConfirm();

  const onSuccessConfirmerHandler = useCallback(async () => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: settingApi.listConfirmer.getKey()
      })
    ]);
  }, [queryClient]);

  const onSuccessApproverHandler = useCallback(async () => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: settingApi.listApprover.getKey()
      })
    ]);
  }, [queryClient]);

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleAddConfirmer = useCallback(() => {
    modalId.current = showModal({
      title: 'Thêm người xác nhận',
      className: 'w-80',
      children: (
        <AddConfirmerForm
          onSuccess={onSuccessConfirmerHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onSuccessConfirmerHandler]);

  const handleAddApprover = useCallback(() => {
    modalId.current = showModal({
      title: 'Thêm người phê duyệt',
      className: 'w-80',
      children: (
        <AddApproverForm
          onSuccess={onSuccessApproverHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onSuccessApproverHandler]);

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
  loader: ({ deps, context: { queryClient } }) =>
    queryClient?.ensureQueryData(settingApi.listConfirmer.getOptions())
});
