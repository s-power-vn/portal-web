import { PaginatedResponse } from 'portal-core';

import { UserItem } from '../../../domain';

export type EmployeeItem = {
  id: string;
  name: string;
  user?: UserItem;
  department?: {
    id?: string;
    name?: string;
    role?: string;
    title?: string;
  };
  role?: string;
  created?: string;
  updated?: string;
  createdBy?: UserItem;
  updatedBy?: UserItem;
};

export type EmployeeListItem = {
  id: string;
  name: string;
  user?: UserItem;
  department?: {
    id?: string;
    name?: string;
    role?: string;
    title?: string;
  };
  role?: string;
  created?: string;
  updated?: string;
};

export type CreateEmployeeInput = {
  name: string;
  user_id: string;
  department_id: string;
  department_role: string;
  department_title: string;
};

export type UpdateEmployeeInput = {
  id: string;
  name?: string;
  user_id?: string;
  department_id?: string;
  department_role?: string;
  department_title?: string;
};

export type EmployeeListResponse = PaginatedResponse<EmployeeListItem>;

export type EmployeeListFullResponse = EmployeeListItem[];
