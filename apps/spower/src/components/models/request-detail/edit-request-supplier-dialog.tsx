import { useQueryClient } from '@tanstack/react-query';
import { number, object, string } from 'yup';

import { FC } from 'react';

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
  RequestDetailSupplierData,
  getAllRequestDetailSuppliersKey,
  useUpdateRequestDetailSupplier
} from '../../../api/request';
import { SupplierDropdownField } from '../supplier/supplier-dropdown-field';

const schema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number().required('Hãy nhập đơn giá nhà cung cấp'),
  volume: number().required('Hãy nhập khối lượng nhà cung cấp')
});

const Content: FC<EditRequestSupplierDialogProps> = ({
  setOpen,
  requestDetailSupplier
}) => {
  const queryClient = useQueryClient();

  const updateDocumentRequestSupplierMutation = useUpdateRequestDetailSupplier(
    requestDetailSupplier.id,
    async () => {
      setOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllRequestDetailSuppliersKey(
            requestDetailSupplier.requestDetail
          )
        })
      ]);
    }
  );

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
        <DialogDescription className={'italic'}>
          Chỉnh sửa thông tin về giá của nhà cung cấp.
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={schema}
        onSubmit={values =>
          updateDocumentRequestSupplierMutation.mutate({
            ...values
          })
        }
        defaultValues={requestDetailSupplier}
        loading={updateDocumentRequestSupplierMutation.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <SupplierDropdownField
          schema={schema}
          name={'supplier'}
          title={'Nhà cung cấp'}
          options={{
            placeholder: 'Hãy chọn nhà cung cấp'
          }}
        />
        <NumericField schema={schema} name={'price'} title={'Đơn giá'} />
        <NumericField schema={schema} name={'volume'} title={'Khối lượng'} />
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type EditRequestSupplierDialogProps = DialogProps & {
  requestDetailSupplier: RequestDetailSupplierData;
};

export const EditRequestSupplierDialog: FC<
  EditRequestSupplierDialogProps
> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
