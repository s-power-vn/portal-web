import { api } from 'portal-api';
import { array, object, string } from 'yup';

import { FC } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { BusinessFormProps, Form, error, success } from '@minhdtb/storeo-theme';

import { ObjectMultiselectField } from '../../object/field/object-multiselect-field';

const schema = object().shape({
  objects: array().of(
    object({
      id: string().required()
    })
  )
});

export type ApplyProcessFormProps = BusinessFormProps & {
  processId: string;
};

export const ApplyProcessForm: FC<ApplyProcessFormProps> = ({
  processId,
  ...props
}) => {
  const process = api.process.byId.useSuspenseQuery({
    variables: processId
  });

  const applyProcess = api.process.apply.useMutation({
    onSuccess: () => {
      success('Áp dụng quy trình thành công');
      props.onSuccess?.();
    },
    onError: e => {
      error(`Lỗi khi áp dụng quy trình: ${e.message}`);
    }
  });

  return (
    <Form
      {...props}
      schema={schema}
      className={'flex flex-col gap-3'}
      defaultValues={{
        objects:
          process.data.expand?.object_via_process?.map(object => ({
            id: object.id
          })) ?? []
      }}
      onSuccess={values => {
        const objectIds = (values.objects || []).map(obj => obj.id);
        applyProcess.mutate({
          processId,
          objectIds
        });
      }}
    >
      <div className={'flex gap-2'}>
        <div className={'whitespace-nowrap text-sm font-medium'}>
          Quy trình đang áp dụng:{' '}
        </div>
        <p className={'text-sm text-red-500'}>
          {process.data.name}
          <Show when={process.data.description}>
            <span className={'text-sm italic text-gray-500'}>
              {' '}
              ({process.data.description})
            </span>
          </Show>
        </p>
      </div>
      <ObjectMultiselectField
        schema={schema}
        name="objects"
        title="Đối tượng áp dụng"
        className={'w-full'}
      />
    </Form>
  );
};
