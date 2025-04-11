import { PaginatedResponse } from 'portal-core';

import { UserItem } from '../../../domain';

export type MaterialItem = {
  id: string;
  name: string;
  code?: string | null;
  unit?: string | null;
  note?: string | null;
  created?: string | null;
  updated?: string | null;
  createdBy?: UserItem;
  updatedBy?: UserItem;
};

export type MaterialListItem = {
  id: string;
  name: string;
  code?: string | null;
  unit?: string | null;
  note?: string | null;
  created?: string | null;
  updated?: string | null;
};

export type MaterialListResponse = PaginatedResponse<MaterialListItem>;

export type CreateMaterialInput = {
  name: string;
  code?: string | null;
  unit?: string | null;
  note?: string | null;
};

export type UpdateMaterialInput = {
  id: string;
  name?: string;
  code?: string | null;
  unit?: string | null;
  note?: string | null;
};
