import _ from 'lodash';
import { array, boolean, number, object, string } from 'yup';

import { Dispatch, FC, SetStateAction, useMemo } from 'react';

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

import { RequestData, useUpdateRequest } from '../../../api/request';
import { arrayToTree, flatTree } from '../../../commons/utils';
import { DocumentRequestDetailListField } from '../document-request-detail/document-request-detail-list-field';

const schema = object().shape({
  name: string().required('Hãy nhập nội dung'),
  documents: array()
    .of(
      object().shape({
        id: string().optional(),
        hasChild: boolean().optional(),
        requestVolume: number()
          .transform((_, originalValue) =>
            Number(originalValue?.toString().replace(/,/g, '.'))
          )
          .typeError('Hãy nhập khối lượng yêu cầu')
          .when('hasChild', (hasChild, schema) => {
            return hasChild[0]
              ? schema
              : schema
                  .moreThan(0, 'Hãy nhập khối lượng yêu cầu')
                  .required('Hãy nhập khối lượng yêu cầu');
          })
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
    .required('Hãy chọn ít nhất 1 hạng mục')
});

const Content: FC<EditRequestDialogProps> = ({ setOpen, request }) => {
  const data = useMemo(() => {
    const v = _.chain(request.expand.requestDetail_via_request)
      .map(it => ({
        ...it.expand.detail,
        id: it.id,
        documentDetailId: it.expand.detail.id,
        requestVolume: it.volume
      }))
      .value();
    return flatTree(arrayToTree(v, 'root', 'documentDetailId'));
  }, [request]);

  const updateDocumentRequest = useUpdateRequest(request.id, () => {
    setOpen(false);
  });

  return (
    <DialogContent className="flex min-w-[800px] flex-col">
      <DialogHeader>
        <DialogTitle>Sửa yêu cầu mua hàng</DialogTitle>
        <DialogDescription className={'italic'}>
          Sửa khối lượng yêu cầu mua hàng
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={schema}
        defaultValues={{
          name: request.name,
          documents: data
        }}
        className={'mt-4 flex flex-col gap-3'}
        loading={updateDocumentRequest.isPending}
        onSubmit={values => updateDocumentRequest.mutate(values)}
      >
        <TextareaField schema={schema} name={'name'} title={'Nội dung'} />
        <DocumentRequestDetailListField
          schema={schema}
          name={'documents'}
          options={{ documentId: '' }}
        />
        <DialogFooter className={'mt-4'}>
          <Button type="submit">Chấp nhận</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
};

export type EditRequestDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  request: RequestData;
};

export const EditRequestDialog: FC<EditRequestDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};