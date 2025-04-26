import { EmployeeItem, IssueItem, ProjectItem } from 'portal-api';
import { PaginatedResponse } from 'portal-core';

export type RequestDetailItem = {
  id: string;
  title: string;
  level: string;
  index?: string;
  unit?: string;
  requestVolume?: number;
  deliveryDate?: string;
  note?: string;
  parent?: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type RequestDetailListItem = {
  id: string;
  title: string;
  level: string;
  index?: string;
  unit?: string;
  requestVolume?: number;
  deliveryDate?: string;
  note?: string;
  parent?: string;
  created?: string;
  updated?: string;
};

export type RequestItem = {
  id: string;
  issue?: IssueItem;
  project?: ProjectItem;
  details?: RequestDetailItem[];
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type RequestListItem = {
  id: string;
  issue?: IssueItem;
  project?: ProjectItem;
  details?: RequestDetailListItem[];
  created?: string;
  updated?: string;
};

export type RequestListResponse = PaginatedResponse<RequestListItem>;

export type CreateRequestInput = {
  title: string;
  object: string;
  code: string;
  startDate?: Date;
  endDate?: Date;
  details: {
    level?: string;
    id?: string;
    index?: string;
    requestVolume?: number;
    title?: string;
    note?: string;
    unit?: string;
  }[];
  attachments?: {
    id?: string;
    name?: string;
    size?: number;
    type?: string;
    file?: File;
    deleted?: boolean;
  }[];
};

export type UpdateRequestInput = {
  id: string;
  title: string;
  code: string;
  startDate?: Date;
  endDate?: Date;
  details: {
    level?: string;
    id?: string;
    index?: string;
    requestVolume?: number;
    title?: string;
    note?: string;
    unit?: string;
  }[];
  deletedIds?: (string | undefined)[];
  attachments?: {
    id?: string;
    name?: string;
    size?: number;
    type?: string;
    file?: File;
    deleted?: boolean;
  }[];
};
