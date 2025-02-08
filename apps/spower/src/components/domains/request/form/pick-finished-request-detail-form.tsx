import { array, object, string } from 'yup';

import { FC } from 'react';

import { type BusinessFormProps, Form } from '@minhdtb/storeo-theme';

import { PickRequestDetailInputField } from '../field/pick-request-detail-input-field';

const schema = object({
  requestDetails: array()
    .of(
      object({
        id: string().required()
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 yêu cầu')
});

export type PickFinishedRequestDetailFormProps = BusinessFormProps & {
  projectId: string;
};

export const PickFinishedRequestDetailForm: FC<
  PickFinishedRequestDetailFormProps
> = ({ projectId, onSuccess, onCancel }) => {
  return (
    <Form
      schema={schema}
      onSubmit={onSuccess}
      onCancel={onCancel}
      className={'flex flex-col gap-3'}
      defaultValues={{
        requestDetails: []
      }}
    >
      <PickRequestDetailInputField
        schema={schema}
        name={'requestDetails'}
        options={{
          projectId
        }}
      />
    </Form>
  );
};
