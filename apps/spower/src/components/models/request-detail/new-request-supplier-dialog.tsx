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

import { useCreateRequestDetailSupplier } from '../../../api';
import { SupplierDropdownField } from '../supplier/supplier-dropdown-field';

const schema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number().required('Hãy nhập đơn giá nhà cung cấp'),
  volume: number().required('Hãy nhập khối lượng nhà cung cấp')
});

const Content: FC<NewRequestSupplierDialogProps> = ({
  setOpen,
  requestDetailId
}) => {
  const createRequestSupplier = useCreateRequestDetailSupplier(() =>
    setOpen(false)
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
          createRequestSupplier.mutate({
            ...values,
            requestDetail: requestDetailId
          })
        }
        defaultValues={{}}
        loading={createRequestSupplier.isPending}
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
