import { Json, PaginatedResponse } from 'portal-core';

import { ObjectItem } from '../../setting/operation';
import { ProjectItem } from '../project/project.type';
import { UserItem } from '../user/user.type';

export type IssueFileItem = {
  id: string;
  name?: string;
  type?: string;
  size?: number;
  url?: string;
  created?: string;
  updated?: string;
  createdBy?: UserItem;
  updatedBy?: UserItem;
};

export type IssueItem = {
  id: string;
  title: string;
  status?: string;
  deadlineStatus?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  object?: ObjectItem;
  project?: ProjectItem;
  assignees?: UserItem[];
  assigned?: string;
  lastAssignee?: UserItem;
  files?: IssueFileItem[];
  approver?: Json;
  created?: string;
  updated?: string;
  createdBy?: UserItem;
  updatedBy?: UserItem;
};

export type IssueListItem = {
  id: string;
  title: string;
  status?: string;
  deadlineStatus?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  object?: ObjectItem;
  project?: ProjectItem;
  assignees?: UserItem[];
  assigned?: string;
  lastAssignee?: UserItem;
  files?: IssueFileItem[];
  approver?: Json;
  created?: string;
  updated?: string;
};

export type IssueListResponse = PaginatedResponse<IssueListItem>;

export type IssueFullListResponse = IssueListItem[];
