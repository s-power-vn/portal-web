import { array, object, string } from 'yup';

import { FC, useState } from 'react';

import { type BusinessFormProps, Form } from '@minhdtb/storeo-theme';

import { PickRequestDetailField } from '../field/pick-request-detail-field';
import { SelectFinishedRequestField } from '../field/select-finished-request-field';

const schema = object({
  field: string().required('Hãy chọn yêu cầu đã hoàn thành'),
  requestDetails: array()
    .of(
      object({
        id: string().required()
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
});

export type PickFinishedRequestDetailFormProps = BusinessFormProps & {
  projectId: string;
};

export const PickFinishedRequestDetailForm: FC<
  PickFinishedRequestDetailFormProps
> = ({ projectId, onSuccess, onCancel }) => {
  const [selectedRequestId, setSelectedRequestId] = useState<
    string | undefined
  >(undefined);

  return (
    <Form
      schema={schema}
      onSuccess={onSuccess}
      onCancel={onCancel}
      className={'flex flex-col gap-3'}
      defaultValues={{
        field: '',
        requestDetails: []
      }}
    >
      <SelectFinishedRequestField
        schema={schema}
        name={'field'}
        title={'Yêu cầu đã hoàn thành'}
        options={{
          projectId,
          onChange: (value: string | string[]) => {
            if (!Array.isArray(value)) {
              setSelectedRequestId(value);
            }
          }
        }}
      />
      <PickRequestDetailField
        schema={schema}
        name={'requestDetails'}
        title={'Danh sách công việc'}
        options={{
          requestId: selectedRequestId
        }}
      />
    </Form>
  );
};
