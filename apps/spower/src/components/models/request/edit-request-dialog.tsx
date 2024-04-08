import { useSuspenseQuery } from '@tanstack/react-query';
import _ from 'lodash';

import { Dispatch, FC, SetStateAction, Suspense, useMemo } from 'react';

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
  UpdateRequestSchema,
  getRequestById,
  useUpdateRequest
} from '../../../api';
import { arrayToTree, flatTree } from '../../../commons/utils';
import { RequestDetailListField } from '../request-detail/request-detail-list-field';

const Content: FC<EditRequestDialogProps> = ({ setOpen, requestId }) => {
  const request = useSuspenseQuery(getRequestById(requestId));

  const updateDocumentRequest = useUpdateRequest(requestId, () =>
    setOpen(false)
  );

  const data = useMemo(() => {
    const v = _.chain(request.data.expand.requestDetail_via_request)
      .map(it => ({
        ...it,
        index: it.expand.detail.index,
        group: it.expand.detail.id,
        parent: it.expand.detail.parent
      }))
      .value();
    return flatTree(arrayToTree(v, `${request.data.document}_root`));
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
          name: request.data?.name,
          details: data.map(it => ({
            ...it,
            requestVolume: it.volume
          }))
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
        <RequestDetailListField schema={UpdateRequestSchema} name={'details'} />
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
  requestId: string;
};

export const EditRequestDialog: FC<EditRequestDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Suspense>
        <Content {...props} />
      </Suspense>
    </Dialog>
  );
};
