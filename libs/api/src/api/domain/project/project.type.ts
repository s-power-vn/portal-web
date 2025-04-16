import { PaginatedResponse } from 'portal-core';

import { CustomerItem } from '../../setting/general';
import { UserItem } from '../user/user.type';

export type ProjectItem = {
  id: string;
  name: string;
  bidding: string;
  customer: CustomerItem;
  created?: string;
  updated?: string;
  createdBy?: UserItem;
  updatedBy?: UserItem;
};

export type ProjectListItem = {
  id: string;
  name: string;
  bidding: string;
  customer: CustomerItem;
  created?: string;
  updated?: string;
  createdBy?: UserItem;
  updatedBy?: UserItem;
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
