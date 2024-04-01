import { array, number, object, string } from 'yup';

import { Dispatch, FC, SetStateAction } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  TextField
} from '@storeo/theme';

import { DocumentPickField } from './document-pick-field';

const schema = object().shape({
  name: string().required('Hãy nhập nội dung'),
  documents: array()
    .of(
      object().shape({
        requestVolume: number()
          .typeError('Hãy nhập khối lượng')
          .required('Hãy nhập khối lượng')
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
    .required('Hãy chọn ít nhất 1 hạng mục')
});

export type DocumentRequestNewProps = {
  documentId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DocumentRequestNew: FC<DocumentRequestNewProps> = ({
  documentId,
  open,
  setOpen
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex min-w-[800px] flex-col">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu mua hàng</DialogTitle>
        </DialogHeader>
        <Form
          schema={schema}
          defaultValues={{
            name: ''
          }}
          className={'mt-4 flex flex-col gap-3'}
          onSubmit={values => console.log(values)}
        >
          <TextField schema={schema} name={'name'} title={'Nội dung'} />
          <DocumentPickField
            schema={schema}
            name={'documents'}
            options={{ documentId }}
          />
          <DialogFooter className={'mt-4'}>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
