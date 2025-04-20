import { Json, PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../../general';
import { ObjectTypeItem } from '../object-type/object-type.type';
import { ObjectItem } from '../object/object.type';

export type ProcessItem = {
  id: string;
  name: string;
  description?: string;
  process?: Json;
  objectType?: ObjectTypeItem;
  objects?: ObjectItem[];
  startNode?: string;
  finishNode?: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type ProcessListItem = {
  id: string;
  name: string;
  description?: string;
  process?: Json;
  objectType?: ObjectTypeItem;
  objects?: ObjectItem[];
  startNode?: string;
  finishNode?: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type ProcessListResponse = PaginatedResponse<ProcessListItem>;

export type CreateProcessInput = {
  name: string;
  description?: string;
  process?: Json;
  object_type_id: string;
  start_node?: string;
  finish_node?: string;
};

export type UpdateProcessInput = {
  id: string;
  name: string;
  description?: string;
  process?: Json;
  object_type_id: string;
  start_node?: string;
  finish_node?: string;
};
