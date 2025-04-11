import { PaginatedResponse } from 'portal-core';

import { UserItem } from '../../../domain';
import { ObjectTypeItem } from '../object-type/object-type.type';
import { ProcessItem } from '../process/process.type';

export type ObjectItem = {
  id: string;
  name: string;
  objectType?: ObjectTypeItem;
  process?: ProcessItem;
  description?: string;
  active?: boolean;
  created?: string;
  updated?: string;
  createdBy?: UserItem;
  updatedBy?: UserItem;
};

export type ObjectListItem = {
  id: string;
  name: string;
  objectType?: ObjectTypeItem;
  process?: ProcessItem;
  description?: string;
  active?: boolean;
  created?: string;
  updated?: string;
};

export type ObjectListResponse = PaginatedResponse<ObjectListItem>;

export type ObjectListFullResponse = ObjectListItem[];

export type CreateObjectInput = {
  name: string;
  object_type_id: string;
  description?: string;
  active?: boolean;
  process_id?: string;
};

export type UpdateObjectInput = {
  id: string;
  name: string;
  object_type_id: string;
  description?: string;
  active?: boolean;
  process_id?: string;
};
