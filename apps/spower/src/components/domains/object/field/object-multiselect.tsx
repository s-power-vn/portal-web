import _ from 'lodash';
import { api } from 'portal-api';

import { FC } from 'react';

import { MultiSelectList, MultiSelectListProps } from '@minhdtb/storeo-theme';

export type ObjectMultiselectProps = Omit<MultiSelectListProps, 'items'>;

export const ObjectMultiselect: FC<ObjectMultiselectProps> = ({ ...props }) => {
  const listObjects = api.object.listFull.useQuery();

  const items = _.map(listObjects.data, object => ({
    id: object.id,
    name: object.name,
    sub: object.process !== '' ? 'Đã áp dụng' : '',
    category: object.expand?.objectType?.name || ''
  }));

  return <MultiSelectList {...props} items={items} />;
};
