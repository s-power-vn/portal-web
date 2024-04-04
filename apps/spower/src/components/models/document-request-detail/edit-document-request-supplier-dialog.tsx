import { useMutation, useQueryClient } from '@tanstack/react-query';
import { number, object, string } from 'yup';

import { FC } from 'react';

import {
  DialogProps,
  DocumentRequestDetailSupplierRecord,
  DocumentRequestDetailSupplierResponse,
  client
} from '@storeo/core';
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

import { SupplierDropdownField } from '../supplier/supplier-dropdown-field';

const schema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number().required('Hãy nhập đơn giá nhà cung cấp'),
  volume: string().required('Hãy nhập khối lượng nhà cung cấp')
});

const Content: FC<EditDocumentRequestSupplierDialogProps> = ({
  setOpen,
  documentRequestSupplier
}) => {
  const queryClient = useQueryClient();

  const updateDocumentMutation = useMutation({
    mutationKey: ['updateDocument'],
    mutationFn: async (params: DocumentRequestDetailSupplierRecord) =>
      documentRequestSupplier?.id
        ? await client
            .collection<DocumentRequestDetailSupplierResponse>(
              'documentRequestDetailSupplier'
            )
            .update(documentRequestSupplier?.id, params)
        : null,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getDocumentRequestSuppliers']
        })
      ]),
    onSettled: () => {
      setOpen(false);
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
        schema={schema}
        onSubmit={values =>
          updateDocumentMutation.mutate({
            ...values
          })
        }
        defaultValues={documentRequestSupplier}
        loading={updateDocumentMutation.isPending}
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

export type EditDocumentRequestSupplierDialogProps = DialogProps & {
  documentRequestSupplier?: DocumentRequestDetailSupplierResponse;
};

export const EditDocumentRequestSupplierDialog: FC<
  EditDocumentRequestSupplierDialogProps
> = ({ open, setOpen, documentRequestSupplier }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Content
        open={open}
        setOpen={setOpen}
        documentRequestSupplier={documentRequestSupplier}
      />
    </Dialog>
  );
};
