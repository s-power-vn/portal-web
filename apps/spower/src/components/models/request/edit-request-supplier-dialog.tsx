import { useQueryClient } from '@tanstack/react-query';

import { FC, Suspense } from 'react';

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
  NumericField
} from '@storeo/theme';

import {
  UpdateRequestDetailSupplierSchema,
  requestApi,
  requestDetailSupplierApi
} from '../../../api';
import { SupplierDropdownField } from '../supplier/supplier-dropdown-field';

const Content: FC<EditRequestSupplierDialogProps> = ({
  setOpen,
  requestDetailSupplierId
}) => {
  const queryClient = useQueryClient();
  const requestDetailSupplier = requestDetailSupplierApi.byId.useSuspenseQuery({
    variables: requestDetailSupplierId
  });

  const updateRequestDetailSupplier =
    requestDetailSupplierApi.update.useMutation({
      onSuccess: async () => {
        setOpen(false);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: requestDetailSupplierApi.listFull.getKey(
              requestDetailSupplier.data.requestDetail
            )
          }),
          queryClient.invalidateQueries({
            queryKey: requestApi.byId.getKey(
              requestDetailSupplier.data.expand.requestDetail.request
            )
          })
        ]);
      }
    });

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
        <DialogDescription className={'italic'}>
          Chỉnh sửa thông tin về giá của nhà cung cấp.
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={UpdateRequestDetailSupplierSchema}
        onSubmit={values =>
          updateRequestDetailSupplier.mutate({
            ...values,
            requestDetailSupplierId
          })
        }
        defaultValues={requestDetailSupplier.data}
        loading={updateRequestDetailSupplier.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <SupplierDropdownField
          schema={UpdateRequestDetailSupplierSchema}
          name={'supplier'}
          title={'Nhà cung cấp'}
          options={{
            placeholder: 'Hãy chọn nhà cung cấp'
          }}
        />
        <NumericField
          schema={UpdateRequestDetailSupplierSchema}
          name={'price'}
          title={'Đơn giá'}
        />
        <NumericField
          schema={UpdateRequestDetailSupplierSchema}
          name={'volume'}
          title={'Khối lượng'}
        />
      </Form>
    </DialogContent>
  );
};

export type EditRequestSupplierDialogProps = DialogProps & {
  requestDetailSupplierId: string;
};

export const EditRequestSupplierDialog: FC<
  EditRequestSupplierDialogProps
> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Suspense>
        <Content {...props} />
      </Suspense>
    </Dialog>
  );
};
