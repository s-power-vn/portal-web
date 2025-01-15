import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { api } from 'portal-api';
import { object, string } from 'yup';

import { Form, TextareaField, success } from '@minhdtb/storeo-theme';

import { CustomerDropdownField } from '../../../../components';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

const Component = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = Route.useParams();

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

  return (
    <div className={'w-1/2 p-2'}>
      <Form
        schema={schema}
        onSubmit={values =>
          updateProject.mutate({
            ...values,
            id: projectId
          })
        }
        onCancel={() => router.history.back()}
        defaultValues={project.data}
        loading={updateProject.isPending || project.isLoading}
        className={'mt-4 flex flex-col gap-3'}
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
    </div>
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/settings'
)({
  component: Component
});
