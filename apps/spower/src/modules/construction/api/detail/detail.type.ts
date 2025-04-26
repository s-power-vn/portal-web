import { EmployeeItem, ProjectItem } from 'portal-api';
import { Json, PaginatedResponse } from 'portal-core';

export type DetailItem = {
  id: string;
  title: string;
  level: string;
  note?: string;
  parent?: DetailItem;
  project?: ProjectItem;
  volume?: number;
  unit?: string;
  unitPrice?: number;
  extend?: Json;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type DetailListItem = {
  id: string;
  title: string;
  level: string;
  note?: string;
  parent?: DetailListItem;
  project?: ProjectItem;
  volume?: number;
  unit?: string;
  unitPrice?: number;
  extend?: Json;
  created?: string;
  updated?: string;
};

export type DetailListResponse = PaginatedResponse<DetailListItem>;

export type DetailFullListResponse = DetailListItem[];

export type CreateDetailInput = {
  title: string;
  note?: string;
  parent_id?: string;
  volume?: number;
  unit?: string;
  unit_price?: number;
  level?: string;
};

export type UpdateDetailInput = {
  id: string;
  title?: string;
  note?: string;
  volume?: number;
  unit?: string;
  unit_price?: number;
  level?: string;
};
