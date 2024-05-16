import { useQueryClient } from '@tanstack/react-query';

import React, { FC, Suspense } from 'react';

import { DialogProps } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  NumericField,
  success
} from '@storeo/theme';

import {
  UpdateRequestDetailSchema,
  requestApi,
  requestDetailApi
} from '../../../api';

const Content: FC<EditRequestDetailDialogProps> = ({
  setOpen,
  requestDetailId
}) => {
  const queryClient = useQueryClient();

  const requestDetail = requestDetailApi.byId.useSuspenseQuery({
    variables: requestDetailId
  });

  const updateDetail = requestDetailApi.update.useMutation({
    onSuccess: async record => {
      success('Chỉnh sửa khối lượng thành công');
      setOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestDetailApi.byId.getKey(requestDetailId)
        }),
        queryClient.invalidateQueries({
          queryKey: requestApi.byId.getKey(requestDetail.data.request)
        })
      ]);
    }
  });

  return (
    <DialogContent className="w-50">
      <DialogHeader>
        <DialogTitle>Sửa khối lượng</DialogTitle>
        <DialogDescription className={'italic'}>
          Chỉnh sửa khối lượng yêu cầu
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={UpdateRequestDetailSchema}
        onSubmit={values =>
          updateDetail.mutate({
            ...values,
            requestDetailId
          })
        }
        defaultValues={requestDetail.data}
        loading={updateDetail.isPending}
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
    </DialogContent>
  );
};

export type EditRequestDetailDialogProps = DialogProps & {
  requestDetailId: string;
};

export const EditRequestDetailDialog: FC<
  EditRequestDetailDialogProps
> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Suspense>
        <Content {...props} />
      </Suspense>
    </Dialog>
  );
};
