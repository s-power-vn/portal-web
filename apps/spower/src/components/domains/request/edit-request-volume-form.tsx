import { api } from 'portal-api';
import { date, number, object, string } from 'yup';

import React, { FC } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  NumericField,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

const schema = object().shape({
  volume: number()
    .required('Hãy nhập khối lượng yêu cầu')
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số')
    .moreThan(0, 'Khối lượng không thể <= 0'),
  index: string(),
  deliveryDate: date().nullable(),
  note: string()
});

export type EditRequestVolumeFormProps = BusinessFormProps & {
  requestDetailId: string;
};

export const EditRequestVolumeForm: FC<EditRequestVolumeFormProps> = props => {
  const requestDetail = api.requestDetail.byId.useSuspenseQuery({
    variables: props.requestDetailId
  });

  const updateDetail = api.requestDetail.updateVolume.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa yêu cầu thành công');
      props.onSuccess?.();
    }
  });

  console.log(requestDetail.data);

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        updateDetail.mutate({
          ...values,
          requestDetailId: props.requestDetailId
        })
      }
      onCancel={props.onCancel}
      defaultValues={{
        ...requestDetail.data,
        deliveryDate: requestDetail.data.deliveryDate
          ? new Date(Date.parse(requestDetail.data.deliveryDate))
          : undefined
      }}
      loading={requestDetail.isPending || updateDetail.isPending}
      className={'flex flex-col gap-3'}
    >
      <div className={'flex items-center gap-2'}>
        <div className={'flex-1'}>
          <NumericField schema={schema} name={'volume'} title={'Khối lượng'} />
        </div>
        <div className={'mt-4 text-sm'}>
          {requestDetail.data.expand.detail?.unit ??
            requestDetail.data.customUnit}
        </div>
      </div>
      <TextField schema={schema} name={'index'} title={'STT'} />
      <DatePickerField
        schema={schema}
        name={'deliveryDate'}
        title={'Ngày cấp'}
      />
      <TextareaField schema={schema} name={'note'} title={'Ghi chú'} />
    </Form>
  );
};
