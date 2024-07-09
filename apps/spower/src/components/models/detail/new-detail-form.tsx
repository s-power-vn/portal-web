import { useQueryClient } from '@tanstack/react-query';
import { number, object, string } from 'yup';

import React, { FC } from 'react';

import { DetailInfoResponse } from '@storeo/core';
import {
  BusinessFormProps,
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

export type NewDetailFormProps = BusinessFormProps & {
  projectId: string;
  parent?: TreeData<DetailInfoResponse>;
};

export const NewDetailForm: FC<NewDetailFormProps> = props => {
  const queryClient = useQueryClient();
  const createDetail = detailApi.create.useMutation({
    onSuccess: async () => {
      success('Tạo hạng mục công việc thành công');
      props.onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailApi.listFull.getKey(props.projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: detailInfoApi.listFull.getKey(props.projectId)
        })
      ]);
    }
  });

  return (
    <Form
      schema={schema}
      onSubmit={values =>
        createDetail.mutate({
          ...values,
          projectId: props.projectId,
          parentId: props.parent?.group
        })
      }
      onCancel={props.onCancel}
      loading={createDetail.isPending}
      className={'flex flex-col gap-3'}
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
      {props.parent ? (
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
  );
};
