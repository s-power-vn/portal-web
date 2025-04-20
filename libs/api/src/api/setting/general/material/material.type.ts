import { PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../employee/employee.type';

export type MaterialItem = {
  id: string;
  name: string;
  code?: string | null;
  unit?: string | null;
  note?: string | null;
  created?: string | null;
  updated?: string | null;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
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
