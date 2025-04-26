import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { projectApi } from 'portal-api';
import { currentEmployeeId } from 'portal-core';
import { object, string } from 'yup';

import { useState } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { Button, Form, TextareaField, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình')
});

const Component = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = Route.useParams();
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const { data: project } = projectApi.byId.useSuspenseQuery({
    variables: projectId
  });

  const { mutate: updateProject, isPending: isUpdating } =
    projectApi.update.useMutation({
      onSuccess: async () => {
        success('Cập nhật dự án thành công');
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: projectApi.byId.getKey(projectId)
          })
        ]);
      }
    });

  const deleteProject = projectApi.delete.useMutation({
    onSuccess: () => {
      success('Xóa dự án thành công');
      router.navigate({ to: '/' });
    }
  });

  return (
    <div className="w-f h-[calc(100vh-100px)] w-full overflow-auto">
      <div className={'w-1/2 p-4'}>
        <Form
          schema={schema}
          onSuccess={values =>
            updateProject({
              id: projectId,
              name: values.name
            })
          }
          onCancel={() => router.history.back()}
          defaultValues={{
            name: project.name
          }}
          loading={isUpdating}
          className={'flex flex-col gap-3'}
        >
          <TextareaField
            schema={schema}
            name={'name'}
            title={'Tên dự án'}
            options={{
              className: 'h-40'
            }}
          />
        </Form>
        <Show when={currentEmployeeId.value === project.createdBy?.id}>
          <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-4">
            <h3 className="text-lg font-medium text-red-800">Vùng nguy hiểm</h3>
            <p className="mt-2 text-sm text-red-700">
              Một khi dự án bị xóa, tất cả dữ liệu liên quan sẽ bị mất và không
              thể khôi phục.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-red-700">
                Để xác nhận, hãy nhập tên dự án: {project.name}
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm placeholder-red-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Nhập tên dự án để xác nhận"
              />
              <Button
                variant="destructive"
                className="mt-4"
                disabled={deleteConfirm.trim() !== project.name.trim()}
                onClick={() => {
                  if (deleteConfirm.trim() === project.name.trim()) {
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

export const Route = createFileRoute(
  '/_private/$organizationId/project/$projectId/settings'
)({
  component: Component
});
