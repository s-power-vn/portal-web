import React, { FC } from 'react';

import {
  Button,
  DialogFooter,
  Form,
  NumericField,
  success
} from '@storeo/theme';

import { UpdateRequestDetailSchema, requestDetailApi } from '../../../api';

export type EditRequestVolumeFormProps = {
  requestDetailId: string;
  onSuccess?: () => void;
};

export const EditRequestVolumeForm: FC<EditRequestVolumeFormProps> = props => {
  const requestDetail = requestDetailApi.byId.useSuspenseQuery({
    variables: props.requestDetailId
  });

  const updateDetail = requestDetailApi.update.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa khối lượng thành công');
      props.onSuccess?.();
    }
  });

  return (
    <Form
      schema={UpdateRequestDetailSchema}
      onSubmit={values =>
        updateDetail.mutate({
          ...values,
          requestDetailId: props.requestDetailId
        })
      }
      defaultValues={requestDetail.data}
      loading={requestDetail.isPending || updateDetail.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <NumericField
        schema={UpdateRequestDetailSchema}
        name={'volume'}
        title={'Khối lượng yêu cầu'}
        options={{}}
      />
      <DialogFooter className={'mt-4'}>
        <Button type="submit">Chấp nhận</Button>
      </DialogFooter>
    </Form>
  );
};
