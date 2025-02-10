import { DetailResponse } from 'portal-core';
import { array, object, string } from 'yup';

import { FC } from 'react';

import { BusinessFormProps, Form } from '@minhdtb/storeo-theme';

import { PickDetailField } from '../field/pick-detail-field';

const schema = object({
  details: array()
    .of(
      object({
        id: string().optional().nullable()
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
});

export type PickDetailFormProps = BusinessFormProps & {
  projectId: string;
  initialValues?: {
    details: DetailResponse[];
  };
};

export const PickDetailForm: FC<PickDetailFormProps> = ({
  projectId,
  onSuccess,
  onCancel,
  initialValues
}) => {
  return (
    <Form
      schema={schema}
      defaultValues={initialValues}
      onSubmit={onSuccess}
      onCancel={onCancel}
      className={'flex flex-col gap-3'}
    >
      <PickDetailField
        schema={schema}
        name={'details'}
        title={'Danh sách hạng mục'}
        options={{
          projectId
        }}
      />
    </Form>
  );
};
