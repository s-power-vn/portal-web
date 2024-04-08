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
  CreateRequestDetailSupplierSchema,
  useCreateRequestDetailSupplier
} from '../../../api';
import { SupplierDropdownField } from '../supplier/supplier-dropdown-field';

const Content: FC<NewRequestSupplierDialogProps> = ({
  setOpen,
  requestDetailId
}) => {
  const createRequestSupplier = useCreateRequestDetailSupplier(
    requestDetailId,
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
        schema={CreateRequestDetailSupplierSchema}
        onSubmit={values => createRequestSupplier.mutate(values)}
        defaultValues={{}}
        loading={createRequestSupplier.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <SupplierDropdownField
          schema={CreateRequestDetailSupplierSchema}
          name={'supplier'}
          title={'Nhà cung cấp'}
          options={{
            placeholder: 'Hãy chọn nhà cung cấp'
          }}
        />
        <NumericField
          schema={CreateRequestDetailSupplierSchema}
          name={'price'}
          title={'Đơn giá'}
        />
        <NumericField
          schema={CreateRequestDetailSupplierSchema}
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

export type NewRequestSupplierDialogProps = DialogProps & {
  requestDetailId: string;
};

export const NewRequestSupplierDialog: FC<
  NewRequestSupplierDialogProps
> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
