import { PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../employee/employee.type';

export type DepartmentItem = {
  id: string;
  name: string;
  description?: string;
  roles?: {
    id: string;
    name: string;
  }[];
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type DepartmentListItem = {
  id: string;
  name: string;
  description?: string;
  roles?: {
    id: string;
    name: string;
  }[];
  created?: string;
  updated?: string;
};

export type DepartmentListResponse = PaginatedResponse<DepartmentListItem>;

export type DepartmentListFullResponse = DepartmentListItem[];

export type CreateDepartmentInput = {
  name: string;
  description?: string;
  roles?: {
    id: string;
    name: string;
  }[];
};

export type UpdateDepartmentInput = {
  id: string;
  name?: string;
  description?: string;
  roles?: {
    id: string;
    name: string;
  }[];
};
