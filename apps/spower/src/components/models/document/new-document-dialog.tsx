import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { object, string } from 'yup';

import { Dispatch, FC, SetStateAction } from 'react';

import {
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

function createDocument(data: DocumentRecord) {
  return client.collection<DocumentResponse>('document').create(data);
}

export type DocumentNewProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const NewDocumentDialog: FC<DocumentNewProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const createDocumentMutation = useMutation({
    mutationKey: ['createDocument'],
    mutationFn: (params: DocumentRecord) => createDocument(params),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
        navigate({
          to: '/document/mine',
          search: {
            pageIndex: 1,
            pageSize: 10,
            filter: ''
          }
        })
      ]),
    onSettled: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Tạo tài liệu</DialogTitle>
          <DialogDescription className={'italic'}>
            Tạo tài liệu thi công mới.
          </DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          onSubmit={values =>
            createDocumentMutation.mutate({
              ...values,
              status: DocumentStatusOptions.ToDo,
              createdBy: client.authStore.model?.id
            })
          }
          defaultValues={{
            name: '',
            bidding: '',
            customer: ''
          }}
          loading={createDocumentMutation.isPending}
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
    </Dialog>
  );
};
