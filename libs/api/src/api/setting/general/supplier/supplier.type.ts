import { PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../employee/employee.type';

export type SupplierItem = {
  id: string;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type SupplierListItem = {
  id: string;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  created?: string;
  updated?: string;
};

export type SupplierListResponse = PaginatedResponse<SupplierListItem>;

export type CreateSupplierInput = {
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
};

export type UpdateSupplierInput = {
  id: string;
  name?: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
};
