import { PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../../setting/general';

export type ProjectItem = {
  id: string;
  name: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type ProjectListItem = {
  id: string;
  name: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type ProjectListResponse = PaginatedResponse<ProjectListItem>;

export type CreateProjectInput = {
  name: string;
  bidding?: string;
  customer_id: string;
};

export type UpdateProjectInput = {
  id: string;
  name?: string;
  bidding?: string;
  customer_id?: string;
};
