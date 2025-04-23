import { Json, PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../../setting/general';

export type ProjectItem = {
  id: string;
  name: string;
  attributes?: Json;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type ProjectListItem = {
  id: string;
  name: string;
  attributes?: Json;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type ProjectListResponse = PaginatedResponse<ProjectListItem>;

export type CreateProjectInput = {
  name: string;
};

export type UpdateProjectInput = {
  id: string;
  name?: string;
};
