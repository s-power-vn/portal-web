import { PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../employee/employee.type';

export type CustomerItem = {
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

export type CustomerListItem = {
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

export type CustomerListResponse = PaginatedResponse<CustomerListItem>;

export type CreateCustomerInput = {
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
};

export type UpdateCustomerInput = {
  id: string;
  name?: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
};
