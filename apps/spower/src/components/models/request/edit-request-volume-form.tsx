import { useQueryClient } from '@tanstack/react-query';

import React, { FC } from 'react';

import {
  Button,
  DialogFooter,
  Form,
  NumericField,
  success
} from '@storeo/theme';

import {
  UpdateRequestDetailVolumeSchema,
  requestApi,
  requestDetailApi
} from '../../../api';

export type EditRequestVolumeFormProps = {
  requestDetailId: string;
  onSuccess?: () => void;
};

export const EditRequestVolumeForm: FC<EditRequestVolumeFormProps> = props => {
  const queryClient = useQueryClient();
  const requestDetail = requestDetailApi.byId.useSuspenseQuery({
    variables: props.requestDetailId
  });

  const updateDetail = requestDetailApi.updateVolume.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa khối lượng thành công');
      props.onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.byIssueId.getKey(
            requestDetail.data.expand.request.issue
          )
        })
      ]);
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
      defaultValues={requestDetail.data}
      loading={requestDetail.isPending || updateDetail.isPending}
      className={'mt-4 flex flex-col gap-3'}
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
