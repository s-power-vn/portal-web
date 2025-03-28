import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';
import { client } from 'portal-core';
import { object, string } from 'yup';

import { useState } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { Button, Form, TextareaField, success } from '@minhdtb/storeo-theme';

import { CustomerDropdownField } from '../../../../components/domains';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

const Component = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = Route.useParams();
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const project = api.project.byId.useSuspenseQuery({
    variables: projectId
  });

  const updateProject = api.project.update.useMutation({
    onSuccess: async () => {
      success('Cập nhật dự án thành công');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: api.project.byId.getKey(projectId)
        })
      ]);
    }
  });

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      success('Xóa dự án thành công');
      router.navigate({ to: '/' });
    }
  });

  return (
    <div className="w-f h-[calc(100vh-100px)] w-full overflow-auto">
      <div className={'w-1/2 p-6'}>
        <Form
          schema={schema}
          onSuccess={values =>
            updateProject.mutate({
              ...values,
              id: projectId
            })
          }
          onCancel={() => router.history.back()}
          defaultValues={project.data}
          loading={updateProject.isPending || project.isLoading}
          className={'flex flex-col gap-3'}
        >
          <TextareaField
            schema={schema}
            name={'bidding'}
            title={'Tên gói thầu'}
            options={{
              className: 'h-40'
            }}
          />
          <TextareaField
            schema={schema}
            name={'name'}
            title={'Tên công trình'}
            options={{
              className: 'h-40'
            }}
          />
          <CustomerDropdownField
            schema={schema}
            name={'customer'}
            title={'Chủ đầu tư'}
            options={{
              placeholder: 'Hãy chọn chủ đầu tư'
            }}
          />
        </Form>
        <Show when={client.authStore?.record?.id === project.data?.createdBy}>
          <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-4">
            <h3 className="text-lg font-medium text-red-800">Vùng nguy hiểm</h3>
            <p className="mt-2 text-sm text-red-700">
              Một khi dự án bị xóa, tất cả dữ liệu liên quan sẽ bị mất và không
              thể khôi phục.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-red-700">
                Để xác nhận, hãy nhập tên công trình: {project.data?.name}
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm placeholder-red-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Nhập tên công trình để xác nhận"
              />
              <Button
                variant="destructive"
                className="mt-4"
                disabled={deleteConfirm.trim() !== project.data?.name.trim()}
                onClick={() => {
                  if (deleteConfirm.trim() === project.data?.name.trim()) {
                    deleteProject.mutate(projectId);
                  }
                }}
              >
                Tôi hiểu hậu quả, xóa dự án này
              </Button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_private/project/$projectId/settings')({
  component: Component
});
