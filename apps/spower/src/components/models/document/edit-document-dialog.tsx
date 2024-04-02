import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { object, string } from 'yup';

import { FC } from 'react';

import {
  DialogProps,
  DocumentRecord,
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

import { CustomerDropdownField } from '../customer/customer-dropdown-field';

const schema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

async function getDocument(id: string) {
  return id
    ? await client.collection<DocumentResponse>('document').getOne(id)
    : null;
}

async function updateDocument(id: string, data: DocumentRecord) {
  return id
    ? await client.collection<DocumentResponse>('document').update(id, data)
    : null;
}

export function getDocumentOptions(id: string) {
  return queryOptions({
    queryKey: ['document', id],
    queryFn: () => getDocument(id)
  });
}

const Content: FC<Omit<EditDocumentDialogProps, 'open'>> = ({
  setOpen,
  documentId
}) => {
  const queryClient = useQueryClient();
  const documentQuery = useQuery(getDocumentOptions(documentId));

  const updateDocumentMutation = useMutation({
    mutationKey: ['updateDocument'],
    mutationFn: (params: DocumentRecord) => updateDocument(documentId, params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
        queryClient.invalidateQueries({ queryKey: ['document', documentId] })
      ]),
    onSettled: () => {
      setOpen(false);
    }
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
        defaultValues={documentQuery.data ?? undefined}
        loading={updateDocumentMutation.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={schema}
          name={'bidding'}
          title={'Tên gói thầu'}
          options={{}}
        />
        <TextField
          schema={schema}
          name={'name'}
          title={'Tên công trình'}
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
  documentId: string;
};

export const EditDocumentDialog: FC<EditDocumentDialogProps> = ({
  open,
  setOpen,
  documentId
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Content setOpen={setOpen} documentId={documentId} />
    </Dialog>
  );
};
