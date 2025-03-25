import * as yup from 'yup';

import { ExpressionRowData } from './types';

export const expressionRowSchema = yup.object<ExpressionRowData>({
  id: yup.string().required(),
  property: yup.string().required('Thuộc tính là bắt buộc'),
  propertyType: yup.string().required('Loại thuộc tính là bắt buộc'),
  operator: yup.string().required('Toán tử là bắt buộc'),
  value: yup.mixed().when(['operator', 'propertyType'], {
    is: (operator: string, propertyType: string) =>
      operator !== 'in' || propertyType !== 'datetime',
    then: schema => schema.required('Giá trị là bắt buộc'),
    otherwise: schema => schema
  }),
  fromDate: yup
    .date()
    .nullable()
    .when(['operator', 'propertyType'], {
      is: (operator: string, propertyType: string) =>
        operator === 'in' && propertyType === 'datetime',
      then: schema => schema.required('Từ ngày là bắt buộc'),
      otherwise: schema => schema.nullable()
    }),
  toDate: yup
    .date()
    .nullable()
    .when(['operator', 'propertyType'], {
      is: (operator: string, propertyType: string) =>
        operator === 'in' && propertyType === 'datetime',
      then: schema => schema.required('Đến ngày là bắt buộc'),
      otherwise: schema => schema.nullable()
    })
});
