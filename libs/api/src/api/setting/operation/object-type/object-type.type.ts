import { PaginatedResponse } from 'portal-core';

export type ObjectTypeItem = {
  id: string;
  name: string;
  description?: string;
  display?: string;
  color?: string;
  icon?: string;
  created?: string;
  updated?: string;
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
