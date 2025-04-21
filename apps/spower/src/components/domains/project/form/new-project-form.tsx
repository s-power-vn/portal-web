import { api } from 'portal-api';
import { object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import { Form, TextField, success } from '@minhdtb/storeo-theme';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình')
});

export type NewProjectFormProps = BusinessFormProps;

export const NewProjectForm: FC<NewProjectFormProps> = props => {
  const createProject = api.project.create.useMutation({
    onSuccess: async () => {
      success('Tạo dự án thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      onSuccess={values =>
        createProject.mutate({
          name: values.name
        })
      }
      defaultValues={{
        name: ''
      }}
      onCancel={props.onCancel}
      loading={createProject.isPending}
      className={'flex w-[480px] flex-col gap-3'}
    >
      <TextField
        schema={schema}
        name={'name'}
        title={'Tên công trình'}
        options={{}}
      />
    </Form>
  );
};
