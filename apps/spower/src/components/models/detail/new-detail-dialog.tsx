import { useQueryClient } from '@tanstack/react-query';
import { number, object, string } from 'yup';

import React, { FC } from 'react';

import { DetailInfoResponse, DialogProps, Show } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  NumericField,
  TextField,
  TextareaField,
  success
} from '@storeo/theme';

import { detailApi, detailInfoApi } from '../../../api';
import { TreeData } from '../../../commons/utils';

const schema = object().shape({
  level: string().required('Hãy nhập ID'),
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) =>
      Number(originalValue.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số')
});

const Content: FC<NewDetailDialogProps> = ({ setOpen, projectId, parent }) => {
  const queryClient = useQueryClient();
  const createDetail = detailApi.create.useMutation({
    onSuccess: async () => {
      success('Tạo hạng mục công việc thành công');
      setOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailApi.listFull.getKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: detailInfoApi.listFull.getKey(projectId)
        })
      ]);
    }
  });

  return (
    <DialogContent className="w-96">
      <DialogHeader>
        <DialogTitle>Tạo mô tả công việc</DialogTitle>
        <DialogDescription className={'italic'}>
          <Show when={parent} fallback={'Tạo đầu mục mô tả công việc chính'}>
            <>
              <span
                className={'inline font-bold'}
              >{`Mục cha: ${parent?.level}`}</span>
              {`(${parent?.title})`}
            </>
          </Show>
        </DialogDescription>
      </DialogHeader>
      <Form
        schema={schema}
        onSubmit={values =>
          createDetail.mutate({
            ...values,
            projectId,
            parentId: parent?.group
          })
        }
        defaultValues={{
          title: '',
          volume: undefined,
          unit: '',
          unitPrice: undefined
        }}
        loading={createDetail.isPending}
        className={'mt-4 flex flex-col gap-3'}
      >
        <TextField
          schema={schema}
          name={'level'}
          title={'ID (Mã công việc)'}
          options={{}}
        />
        <TextareaField
          schema={schema}
          name={'title'}
          title={'Mô tả công việc'}
          options={{}}
        />
        {parent ? (
          <>
            <NumericField
              schema={schema}
              name={'volume'}
              title={'Khối lượng thầu'}
              options={{}}
            />
            <TextField
              schema={schema}
              name={'unit'}
              title={'Đơn vị'}
              options={{}}
            />
            <NumericField
              schema={schema}
              name={'unitPrice'}
              title={'Đơn giá thầu'}
              options={{}}
            />
          </>
        ) : null}
      </Form>
    </DialogContent>
  );
};

export type NewDetailDialogProps = DialogProps & {
  projectId: string;
  parent?: TreeData<DetailInfoResponse>;
};

export const NewDetailDialog: FC<NewDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Content {...props} />
    </Dialog>
  );
};
