import { api } from 'portal-api';
import { array, date, object, string } from 'yup';

import type { FC } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  TextField,
  TextareaField,
  error,
  success
} from '@minhdtb/storeo-theme';

import { MultipleFileSelectField } from '../../../../../components/file';
import { PriceInputField } from '../field/price-input-field';

const schema = object().shape({
  title: string().required('Hãy nhập nội dung'),
  code: string().required('Hãy nhập số phiếu'),
  startDate: date().required('Hãy chọn ngày bắt đầu'),
  endDate: date()
    .required('Hãy chọn ngày kết thúc')
    .test({
      name: 'checkEndDate',
      message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      test: function () {
        const startDate = this.parent.startDate;
        const endDate = this.parent.endDate;
        if (startDate && endDate) {
          return startDate.getTime() < endDate.getTime();
        }
        return true;
      }
    }),
  data: array()
    .of(
      object().shape({
        id: string().optional(),
        prices: object().optional()
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
    .required('Hãy chọn ít nhất 1 hạng mục')
    .test({
      name: 'checkSuppliers',
      message: 'Hãy thêm ít nhất 1 nhà cung cấp',
      test: function (value) {
        if (!value) return false;
        const suppliers = value.flatMap(item =>
          item.prices ? Object.keys(item.prices) : []
        );
        return suppliers.length > 0;
      }
    }),
  attachments: array()
    .of(
      object().shape({
        id: string().optional()
      })
    )
    .max(10, 'Giới hạn tải lên tối đa 10 file')
    .optional()
});

export type NewPriceFormProps = BusinessFormProps & {
  projectId: string;
  objectId: string;
};

export const NewPriceForm: FC<NewPriceFormProps> = ({
  projectId,
  objectId,
  onSuccess,
  onCancel
}) => {
  const createPrice = api.price.create.useMutation({
    onSuccess: () => {
      success('Tạo yêu cầu giá thành công');
      onSuccess?.();
    },
    onError: () => {
      error('Lỗi khi tạo yêu cầu giá');
    }
  });

  return (
    <Form
      schema={schema}
      defaultValues={{
        title: '',
        code: '',
        startDate: new Date(),
        endDate: undefined,
        data: [],
        attachments: []
      }}
      className={'flex flex-col gap-4'}
      onSuccess={value => {
        createPrice.mutate({
          ...value,
          project: projectId,
          object: objectId,
          details: value.data.map(item => ({
            ...item
          }))
        });
      }}
      onCancel={onCancel}
      loading={createPrice.isPending}
    >
      <TextareaField
        schema={schema}
        name={'title'}
        title={'Nội dung công việc'}
      />
      <div className={'flex items-start gap-2'}>
        <TextField
          schema={schema}
          name={'code'}
          className={'flex-1'}
          title={'Số phiếu'}
          options={{
            maxLength: 20
          }}
        />
        <DatePickerField
          schema={schema}
          name={'startDate'}
          title={'Ngày bắt đầu'}
          className={'flex-1'}
          options={{
            showTime: true
          }}
        />
        <span className={'pt-4'}>-</span>
        <DatePickerField
          schema={schema}
          name={'endDate'}
          title={'Ngày kết thúc'}
          className={'flex-1'}
          options={{
            showTime: true
          }}
        />
      </div>
      <PriceInputField
        schema={schema}
        name={'data'}
        options={{ projectId: projectId }}
      />
      <MultipleFileSelectField
        schema={schema}
        name={'attachments'}
        title={'File đính kèm'}
      />
    </Form>
  );
};
