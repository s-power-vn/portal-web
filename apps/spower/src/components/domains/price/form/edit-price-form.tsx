import { api } from 'portal-api';
import { array, date, mixed, object, string } from 'yup';

import { FC } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

import { MultipleFileSelectField } from '../../../file';
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
  deletedIds: array().of(string()).optional(),
  attachments: mixed().optional()
});

export type EditPriceFormProps = BusinessFormProps & {
  issueId: string;
};

export const EditPriceForm: FC<EditPriceFormProps> = ({
  issueId,
  onCancel,
  onSuccess
}) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const price = api.price.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const update = api.price.update.useMutation({
    onSuccess: () => {
      success('Cập nhật giá thành công');
      onSuccess?.();
    }
  });

  return (
    <Form
      schema={schema}
      defaultValues={{
        title: issue.data?.title,
        code: issue.data?.code,
        startDate: new Date(Date.parse(issue.data?.startDate ?? '')),
        endDate: new Date(Date.parse(issue.data?.endDate ?? '')),
        data: price.data?.expand.priceDetail_via_price,
        attachments: []
      }}
      className={'flex flex-col gap-4'}
      onSubmit={value => {
        update.mutate({
          ...value,
          id: issueId,
          project: issue.data?.project ?? '',
          details: value.data ?? []
        });
      }}
      onCancel={onCancel}
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
        options={{ projectId: issue.data?.project }}
      />
      <MultipleFileSelectField
        schema={schema}
        name={'attachments'}
        title={'File đính kèm'}
      />
    </Form>
  );
};
