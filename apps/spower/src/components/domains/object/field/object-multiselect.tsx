import _ from 'lodash';
import { api } from 'portal-api';
import { ObjectTypeOptions } from 'portal-core';
import { object } from 'yup';

import { FC, useCallback } from 'react';

import { MultiSelectList, MultiSelectListProps } from '@minhdtb/storeo-theme';

export type ObjectMultiselectProps = Omit<MultiSelectListProps, 'items'>;

export const ObjectMultiselect: FC<ObjectMultiselectProps> = ({ ...props }) => {
  const listObjects = api.object.listFull.useQuery();

  const objectType = useCallback(
    (type: ObjectTypeOptions) => {
      switch (type) {
        case ObjectTypeOptions.Request:
          return 'Yêu cầu';
        case ObjectTypeOptions.Price:
          return 'Báo giá';
        case ObjectTypeOptions.Document:
          return 'Tài liệu';
        case ObjectTypeOptions.Task:
          return 'Công việc';
        default:
          return '';
      }
    },
    [object]
  );

  const items = _.map(listObjects.data, object => ({
    id: object.id,
    name: object.name,
    sub: object.process !== '' ? 'Đã áp dụng' : '',
    category: objectType(object.type)
  }));

  return <MultiSelectList {...props} items={items} />;
};
