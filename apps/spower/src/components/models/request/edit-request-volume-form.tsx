import React, { FC } from 'react';

import { BusinessFormProps, Form, NumericField, success } from '@storeo/theme';

import {
  UpdateRequestDetailVolumeSchema,
  requestDetailApi
} from '../../../api';

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
      schema={UpdateRequestDetailVolumeSchema}
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
        schema={UpdateRequestDetailVolumeSchema}
        name={'volume'}
        title={'Khối lượng yêu cầu'}
        options={{}}
      />
    </Form>
  );
};
