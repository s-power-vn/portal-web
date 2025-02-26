import { api } from 'portal-api';
import { object, string } from 'yup';

import { FC } from 'react';

import {
  BusinessFormProps,
  Form,
  TextField,
  TextareaField,
  error,
  success
} from '@minhdtb/storeo-theme';

import { FlowEditorField } from '../../flow';
import { ProcessData } from '../../flow/types';

const schema = object().shape({
  name: string().required('Tên quy trình là bắt buộc'),
  description: string(),
  done: string().nullable(),
  process: object().shape({}).optional()
});

export type EditProcessFormProps = BusinessFormProps & {
  processId: string;
};

export const EditProcessForm: FC<EditProcessFormProps> = ({
  processId,
  ...props
}) => {
  const process = api.process.byId.useSuspenseQuery({
    variables: processId
  });

  const updateProcess = api.process.update.useMutation({
    onSuccess: () => {
      success('Cập nhật quy trình thành công');
      props.onSuccess?.();
    },
    onError: () => {
      error('Cập nhật quy trình thất bại');
    }
  });

  return (
    <Form
      {...props}
      schema={schema}
      className="flex h-full w-full flex-col gap-3"
      onSuccess={values => {
        const processData = values.process as ProcessData;
        const doneNode = processData?.nodes?.find(node => node.done === true);

        updateProcess.mutate({
          id: processId,
          ...values,
          done: doneNode?.id || undefined
        });
      }}
      defaultValues={{
        name: process.data?.name,
        description: process.data?.description,
        process: process.data?.process as ProcessData | undefined
      }}
    >
      <TextField schema={schema} name="name" title="Tên quy trình" />
      <TextareaField schema={schema} name="description" title="Mô tả" />
      <FlowEditorField
        schema={schema}
        name="process"
        title="Quy trình"
        className="flex-1"
      />
    </Form>
  );
};
