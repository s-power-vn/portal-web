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
import { Node, ProcessData } from '../../flow/types';
import { ObjectTypeDropdownField } from '../../object';

const schema = object().shape({
  name: string().required('Tên quy trình là bắt buộc'),
  description: string(),
  objectType: string().required('Loại đối tượng là bắt buộc'),
  process: object()
    .test(
      'has-start-node',
      'Quy trình phải có nút bắt đầu',
      function (value: any) {
        if (!value || !value.nodes || !Array.isArray(value.nodes)) {
          return false;
        }

        const nodes = value.nodes as Node[];
        return nodes.some(node => node.type === 'start');
      }
    )
    .test(
      'has-finished-node',
      'Quy trình phải có nút hoàn thành',
      function (value: any) {
        if (!value || !value.nodes || !Array.isArray(value.nodes)) {
          return false;
        }

        const nodes = value.nodes as Node[];
        return nodes.some(node => node.type === 'finish');
      }
    )
    .required('Quy trình là bắt buộc')
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
        const startNode = processData?.nodes?.find(
          node => node.type === 'start'
        );

        const finishNode = processData?.nodes?.find(
          node => node.type === 'finish'
        );

        updateProcess.mutate({
          id: processId,
          ...values,
          startNode: startNode?.id || undefined,
          finishNode: finishNode?.id || undefined
        });
      }}
      defaultValues={{
        name: process.data?.name,
        description: process.data?.description,
        objectType: process.data?.objectType,
        process: process.data?.process as ProcessData | undefined
      }}
    >
      <div className="flex w-full gap-3">
        <div className="flex flex-1 flex-col gap-3">
          <TextField schema={schema} name="name" title="Tên quy trình" />
          <ObjectTypeDropdownField
            schema={schema}
            name="objectType"
            title="Loại đối tượng"
            options={{
              disabled: true
            }}
          />
        </div>
        <div className="flex h-full flex-1 flex-col gap-3">
          <TextareaField
            schema={schema}
            name="description"
            title="Mô tả"
            className="h-full"
            options={{
              className: 'flex-1'
            }}
          />
        </div>
      </div>
      <FlowEditorField
        schema={schema}
        name="process"
        title="Quy trình"
        className="flex-1"
        options={{
          objectType: process.data?.expand?.objectType.name
        }}
      />
    </Form>
  );
};
