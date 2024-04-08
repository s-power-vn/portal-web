import _ from 'lodash';

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

import {
  RequestData,
  UpdateRequestSchema,
  useUpdateRequest
} from '../../../api';
import { arrayToTree, flatTree } from '../../../commons/utils';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

const Content: FC<EditRequestDialogProps> = ({ setOpen, request }) => {
  const updateDocumentRequest = useUpdateRequest(request.id, () =>
    setOpen(false)
  );

  const data = useMemo(() => {
    const v = _.chain(request.expand.requestDetail_via_request)
      .map(it => ({
        ...it.expand.detail,
        id: it.id,
        documentDetailId: it.expand.detail.id,
        requestVolume: it.volume
      }))
      .value();
    return flatTree(
      arrayToTree(v, `${request.document}_root`, 'documentDetailId')
    );
  }, [request]);

  return (
    <DialogContent className="flex min-w-[800px] flex-col">
      <DialogHeader>
        <DialogTitle>Sửa yêu cầu mua hàng</DialogTitle>
        <DialogDescription className={'italic'}>
          Sửa khối lượng yêu cầu mua hàng
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={UpdateRequestSchema}
        defaultValues={{
          name: request.name,
          details: data
        }}
        className={'mt-4 flex flex-col gap-3'}
        loading={updateDocumentRequest.isPending}
        onSubmit={values => updateDocumentRequest.mutate(values)}
      >
        <TextareaField
          schema={UpdateRequestSchema}
          name={'name'}
          title={'Nội dung'}
        />
        <RequestDetailListField
          schema={UpdateRequestSchema}
          name={'details'}
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
