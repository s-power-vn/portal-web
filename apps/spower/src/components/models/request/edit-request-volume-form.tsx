import { number, object } from 'yup';

import React, { FC } from 'react';

import { BusinessFormProps, Form, NumericField, success } from '@storeo/theme';

import { requestDetailApi } from '../../../api';

const schema = object().shape({
  volume: number()
    .required('Hãy nhập khối lượng yêu cầu')
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số')
    .moreThan(0, 'Khối lượng không thể <= 0')
});

export type EditRequestVolumeFormProps = BusinessFormProps & {
  requestDetailId: string;
};

export const EditRequestVolumeForm: FC<EditRequestVolumeFormProps> = props => {
  const requestDetail = requestDetailApi.byId.useSuspenseQuery({
    variables: props.requestDetailId
  });

  const updateDetail = requestDetailApi.updateVolume.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa khối lượng thành công');
      props.onSuccess?.();
    }
  });

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
      defaultValues={requestDetail.data}
      loading={requestDetail.isPending || updateDetail.isPending}
      className={'flex flex-col gap-3'}
    >
      <NumericField
        schema={schema}
        name={'volume'}
        title={'Khối lượng yêu cầu'}
        options={{}}
      />
    </Form>
  );
};
