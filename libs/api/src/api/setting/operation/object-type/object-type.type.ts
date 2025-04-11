import { PaginatedResponse } from 'portal-core';

import { UserItem } from '../../../domain';

export type ObjectTypeItem = {
  id: string;
  name: string;
  description?: string;
  display?: string;
  color?: string;
  icon?: string;
  created?: string;
  updated?: string;
  createdBy?: UserItem;
  updatedBy?: UserItem;
};

export type ObjectTypeListItem = {
  id: string;
  name: string;
  description?: string;
  display?: string;
  color?: string;
  icon?: string;
  created?: string;
  updated?: string;
};

export type ObjectTypeListResponse = PaginatedResponse<ObjectTypeListItem>;
