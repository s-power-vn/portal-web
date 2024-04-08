import { useQueryClient } from '@tanstack/react-query';

import { FC } from 'react';

import { DialogProps, DocumentResponse } from '@storeo/core';
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
  UpdateDocumentSchema,
  getAllDocumentsKey,
  getMineDocumentsKey,
  getWaitingDocumentsKey,
  useUpdateDocument
} from '../../../api';
import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const Content: FC<EditDocumentDialogProps> = ({
  setOpen,
  search,
  screen,
  document
}) => {
  const queryClient = useQueryClient();

  const updateDocumentMutation = useUpdateDocument(document.id, async () => {
    setOpen(false);
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          screen === 'all'
            ? getAllDocumentsKey(search)
            : screen === 'wating'
              ? getWaitingDocumentsKey(search)
              : getMineDocumentsKey(search)
      })
    ]);
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
        schema={UpdateDocumentSchema}
        onSubmit={values => updateDocumentMutation.mutate(values)}
        defaultValues={document}
        loading={updateDocumentMutation.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={UpdateDocumentSchema}
          name={'name'}
          title={'Tên công trình'}
          options={{}}
        />
        <TextField
          schema={UpdateDocumentSchema}
          name={'bidding'}
          title={'Tên gói thầu'}
          options={{}}
        />
        <CustomerDropdownField
          schema={UpdateDocumentSchema}
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
