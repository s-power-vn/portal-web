import { Json, PaginatedResponse } from 'portal-core';

import { UserItem } from '../user/user.type';

export type OrganizationItem = {
  id: string;
  name: string;
  role: string;
  settings: Json;
  members: {
    role: string;
    user: UserItem;
  }[];
  created: string;
  updated: string;
  createdBy: UserItem;
  updatedBy: UserItem;
};

export type OrganizationListItem = {
  id: string;
  name: string;
  role: string;
  settings: Json;
  members: {
    role: string;
    user: UserItem;
  }[];
  created: string;
  updated: string;
  createdBy: UserItem;
  updatedBy: UserItem;
};

export type OrganizationListResponse = PaginatedResponse<OrganizationListItem>;

export type OrganizationFullListResponse = OrganizationListItem[];

export type CreateOrganizationInput = {
  name: string;
};

export type UpdateOrganizationInput = {
  id: string;
  name: string;
};
