import { object, string } from 'yup';

import { Dispatch, FC, SetStateAction } from 'react';

import { usePb } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  TextareaField
} from '@storeo/theme';

import { DocumentPick } from './document-pick';

const schema = object().shape({
  name: string().required('Hãy nhập nội dung')
});

export type DocumentRequestNewProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DocumentRequestNew: FC<DocumentRequestNewProps> = ({
  open,
  setOpen
}) => {
  const pb = usePb();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu mua hàng</DialogTitle>
          <DialogDescription>Tạo yêu cầu mua hàng mới.</DialogDescription>
        </DialogHeader>
        <Form
          schema={schema}
          defaultValues={{
            name: ''
          }}
          className={'mt-4 flex flex-col gap-3'}
        >
          <TextareaField
            schema={schema}
            name={'name'}
            title={'Nội dung'}
            options={{}}
          />
          <DocumentPick />
          <DialogFooter className={'mt-4'}>
            <Button type="submit">Chấp nhận</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
