import { useQueryClient } from '@tanstack/react-query';

import React, { FC } from 'react';

import {
  Button,
  DialogFooter,
  Form,
  NumericField,
  success
} from '@storeo/theme';

import {
  UpdateRequestDetailPriceSchema,
  requestApi,
  requestDetailApi
} from '../../../api';
import { SupplierDropdownField } from '../supplier/supplier-dropdown-field';

export type EditRequestPriceFormProps = {
  requestDetailId: string;
  onSuccess?: () => void;
};

export const EditRequestPriceForm: FC<EditRequestPriceFormProps> = props => {
  const queryClient = useQueryClient();
  const requestDetail = requestDetailApi.byId.useSuspenseQuery({
    variables: props.requestDetailId
  });

  const updateDetail = requestDetailApi.updatePrice.useMutation({
    onSuccess: async () => {
      success('Chỉnh sửa đơn giá thành công');
      props.onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: requestApi.byId.getKey(requestDetail.data.request)
        })
      ]);
    }
  });

  return (
    <Form
      schema={UpdateRequestDetailPriceSchema}
      onSubmit={values =>
        updateDetail.mutate({
          ...values,
          requestDetailId: props.requestDetailId
        })
      }
      defaultValues={requestDetail.data}
      loading={requestDetail.isPending || updateDetail.isPending}
      className={'mt-4 flex flex-col gap-3'}
    >
      <SupplierDropdownField
        schema={UpdateRequestDetailPriceSchema}
        name={'supplier'}
        title={'Nhà cung cấp'}
      />
      <NumericField
        schema={UpdateRequestDetailPriceSchema}
        name={'price'}
        title={'Đơn giá'}
      />
      <DialogFooter className={'mt-4'}>
        <Button type="submit">Chấp nhận</Button>
      </DialogFooter>
    </Form>
  );
};
