import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { Form, TextareaField, success } from '@storeo/theme';

import {
  UpdateProjectSchema,
  getProjectByIdKey,
  useGetProjectById,
  useUpdateProject
} from '../../../../api';
import { CustomerDropdownField } from '../../../../components';

const Component = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = Route.useParams();

  const project = useGetProjectById(projectId);

  const updateProject = useUpdateProject(projectId, async () => {
    success('Cập nhật dự án thành công');
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getProjectByIdKey(projectId)
      })
    ]);
  });

  return (
    <div className={'w-1/2 p-2'}>
      <Form
        schema={UpdateProjectSchema}
        onSubmit={values => updateProject.mutate(values)}
        onCancel={() => router.history.back()}
        defaultValues={project.data}
        loading={updateProject.isPending || project.isLoading}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextareaField
          schema={UpdateProjectSchema}
          name={'bidding'}
          title={'Tên gói thầu'}
          options={{
            className: 'h-40'
          }}
        />
        <TextareaField
          schema={UpdateProjectSchema}
          name={'name'}
          title={'Tên công trình'}
          options={{
            className: 'h-40'
          }}
        />
        <CustomerDropdownField
          schema={UpdateProjectSchema}
          name={'customer'}
          title={'Chủ đầu tư'}
          options={{
            placeholder: 'Hãy chọn chủ đầu tư'
          }}
        />
      </Form>
    </div>
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/settings'
)({
  component: Component
});
