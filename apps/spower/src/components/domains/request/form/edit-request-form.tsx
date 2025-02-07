import _ from 'lodash';
import { api } from 'portal-api';
import { array, boolean, date, mixed, number, object, string } from 'yup';

import { FC, useMemo } from 'react';

import {
  BusinessFormProps,
  DatePickerField,
  Form,
  TextField,
  TextareaField,
  success
} from '@minhdtb/storeo-theme';

import { arrayToTree, compareVersion } from '../../../../commons/utils';
import { RequestDetailItem } from '../request';
import { RequestInputField } from '../request-input-field';

const schema = object({
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
  details: array()
    .of(
      object().shape({
        id: string().optional(),
        index: string().optional(),
        note: string().optional(),
        deliveryDate: date().optional().nullable(),
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
    .required('Hãy chọn ít nhất 1 hạng mục'),
  deletedIds: array().of(string()).optional(),
  attachments: mixed().optional()
});

export type EditRequestFormProps = BusinessFormProps & {
  issueId: string;
};

export const EditRequestForm: FC<EditRequestFormProps> = ({
  issueId,
  onCancel,
  onSuccess
}) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const request = api.request.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const update = api.request.update.useMutation({
    onSuccess: () => {
      success('Cập nhật yêu cầu thành công');
      onSuccess?.();
    }
  });

  const v = useMemo<RequestDetailItem[]>(() => {
    return _.chain(
      request.data ? request.data?.expand.requestDetail_via_request : []
    )
      .map(it => {
        const { customLevel, customUnit, customTitle, ...rest } = it;

        return {
          id: it.id,
          title: it.expand?.detail.title ?? customTitle,
          unit: it.expand?.detail.unit ?? customUnit,
          group: it.expand?.detail.id ?? customLevel,
          level: it.expand?.detail.level ?? customLevel,
          requestVolume: it.requestVolume,
          deliveryDate: it.deliveryDate,
          note: it.note,
          index: it.index,
          parent: it.expand?.detail.parent ?? `${request.data?.project}-root`
        };
      })
      .value();
  }, [request.data]);

  const requestDetails = useMemo(() => {
    return arrayToTree(v, `${request.data?.project}-root`);
  }, [request.data?.project, v]);

  const listDetails = useMemo(() => {
    const list = [];
    const queue = [...(requestDetails || [])];
    while (queue.length) {
      const node = queue.shift();
      list.push(node);
      queue.push(...(node?.children || []));
    }
    return list.sort((v1, v2) =>
      compareVersion(v1?.level ?? '', v2?.level ?? '')
    );
  }, [requestDetails]);

  return (
    <Form
      schema={schema}
      onSubmit={values => {
        update.mutate({
          ...values,
          id: issueId,
          project: issue.data?.project
        });
      }}
      defaultValues={{
        code: issue.data?.code,
        title: issue.data?.title,
        startDate: new Date(Date.parse(issue.data?.startDate ?? '')),
        endDate: new Date(Date.parse(issue.data?.endDate ?? '')),
        details: listDetails.map(it => ({
          ...it,
          deliveryDate: it?.deliveryDate
            ? new Date(Date.parse(it.deliveryDate ?? ''))
            : undefined
        }))
      }}
      className={'flex flex-col gap-4'}
      loading={issue.isLoading || request.isLoading || update.isPending}
      onCancel={onCancel}
    >
      <TextareaField schema={schema} name="title" title="Nội dung công việc" />
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
      <RequestInputField
        schema={schema}
        name={'details'}
        options={{ projectId: issue.data?.project }}
      />
    </Form>
  );
};
