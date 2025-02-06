import { api } from 'portal-api';
import type { DetailInfoResponse } from 'portal-core';
import { number, object, string } from 'yup';

import type { FC } from 'react';

import type { BusinessFormProps } from '@minhdtb/storeo-theme';
import {
  Form,
  NumericField,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

import type { TreeData } from '../../../commons/utils';

const schema = object().shape({
  level: string().required('Hãy nhập ID'),
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) => {
      if (originalValue === '' || Number.isNaN(originalValue)) {
        return undefined;
      }
      return Number(originalValue?.toString().replace(/,/g, '.'));
    })
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) => {
      if (originalValue === '' || Number.isNaN(originalValue)) {
        return undefined;
      }
      return Number(originalValue?.toString().replace(/,/g, '.'));
    })
    .typeError('Sai định dạng số')
});

export type NewDetailFormProps = BusinessFormProps & {
  projectId: string;
  parent?: TreeData<DetailInfoResponse>;
};

export const NewDetailForm: FC<NewDetailFormProps> = props => {
  const createDetail = api.detail.create.useMutation({
    onSuccess: async () => {
      success('Tạo hạng mục công việc thành công');
      props.onSuccess?.();
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
      defaultValues={{
        level: '',
        title: '',
        unit: ''
      }}
      onCancel={props.onCancel}
      loading={createDetail.isLoading}
      className={'flex flex-col gap-3'}
    >
      <TextField schema={schema} name={'level'} title={'ID (Mã công việc)'} />
      <TextareaField schema={schema} name={'title'} title={'Mô tả công việc'} />
      {props.parent ? (
        <>
          <NumericField
            schema={schema}
            name={'volume'}
            title={'Khối lượng thầu'}
          />
          <TextField schema={schema} name={'unit'} title={'Đơn vị'} />
          <NumericField
            schema={schema}
            name={'unitPrice'}
            title={'Đơn giá thầu'}
          />
        </>
      ) : null}
    </Form>
  );
};
