import { useSuspenseQuery } from '@tanstack/react-query';

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
  UpdateRequestDetailSupplierSchema,
  getRequestDetailSupplierById,
  useUpdateRequestDetailSupplier
} from '../../../api';
import { SupplierDropdownField } from '../supplier/supplier-dropdown-field';

const Content: FC<EditRequestSupplierDialogProps> = ({
  setOpen,
  requestDetailSupplierId
}) => {
  const requestDetailSupplier = useSuspenseQuery(
    getRequestDetailSupplierById(requestDetailSupplierId)
  );

  const updateRequestDetailSupplier = useUpdateRequestDetailSupplier(
    requestDetailSupplierId,
    () => setOpen(false)
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
        schema={UpdateRequestDetailSupplierSchema}
        onSubmit={values => updateRequestDetailSupplier.mutate(values)}
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
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
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
      <Content {...props} />
    </Dialog>
  );
};
