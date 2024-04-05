import { useQueryClient } from '@tanstack/react-query';
import { object, string } from 'yup';

import { FC } from 'react';

import {
  DialogProps,
  DocumentResponse,
  DocumentStatusOptions,
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
  TextField
} from '@storeo/theme';

import {
  DocumentSearch,
  getAllDocumentsKey,
  getMineDocumentsKey,
  getWaitingDocumentsKey,
  useUpdateDocument
} from '../../../api';
import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

const Content: FC<EditDocumentDialogProps> = ({
  setOpen,
  search,
  screen,
  document
}) => {
  const queryClient = useQueryClient();

  const updateDocumentMutation = useUpdateDocument(document.id, async () => {
    setOpen(false);
    await queryClient.invalidateQueries({
      queryKey:
        screen === 'all'
          ? getAllDocumentsKey(search)
          : screen === 'wating'
            ? getWaitingDocumentsKey(search)
            : getMineDocumentsKey(search)
    });
  });

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
        <DialogDescription className={'italic'}>
          Chỉnh sửa thông tin chung của tài liệu thi công.
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={schema}
        onSubmit={values =>
          updateDocumentMutation.mutate({
            ...values,
            status: DocumentStatusOptions.ToDo,
            createdBy: client.authStore.model?.id
          })
        }
        defaultValues={document}
        loading={updateDocumentMutation.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={schema}
          name={'name'}
          title={'Tên công trình'}
          options={{}}
        />
        <TextField
          schema={schema}
          name={'bidding'}
          title={'Tên gói thầu'}
          options={{}}
        />
        <CustomerDropdownField
          schema={schema}
          name={'customer'}
          title={'Chủ đầu tư'}
          options={{
            placeholder: 'Hãy chọn chủ đầu tư'
          }}
        />
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type EditDocumentDialogProps = DialogProps & {
  screen: 'wating' | 'mine' | 'all';
  search: DocumentSearch;
  document: DocumentResponse;
};

export const EditDocumentDialog: FC<EditDocumentDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
