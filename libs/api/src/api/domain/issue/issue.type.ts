import { Json, PaginatedResponse } from 'portal-core';

import { EmployeeItem } from '../../setting/general';
import { ObjectItem } from '../../setting/operation';
import { ProjectItem } from '../project/project.type';

export type IssueFileItem = {
  id: string;
  name?: string;
  type?: string;
  size?: number;
  url?: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type IssueItem = {
  id: string;
  title: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  deadlineStatus?: string;
  processStatus?: string;
  object?: ObjectItem;
  project?: ProjectItem;
  files?: IssueFileItem[];
  assignees?: EmployeeItem[];
  lastAssignee?: EmployeeItem;
  approvers?: Json;
  assigned?: string;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type IssueListItem = {
  id: string;
  title: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  deadlineStatus?: string;
  processStatus?: string;
  object?: ObjectItem;
  project?: ProjectItem;
  assignees?: EmployeeItem[];
  lastAssignees?: EmployeeItem[];
  files?: IssueFileItem[];
  approvers?: Json;
  created?: string;
  updated?: string;
};

export type IssueListResponse = PaginatedResponse<IssueListItem>;

export type IssueFullListResponse = IssueListItem[];
