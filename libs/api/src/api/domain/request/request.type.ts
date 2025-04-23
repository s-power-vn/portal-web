import { PaginatedResponse } from 'portal-core';

import { DetailItem } from '..';
import { EmployeeItem } from '../../setting/general';
import { IssueItem } from '../issue/issue.type';
import { ProjectItem } from '../project/project.type';

export type RequestItem = {
  id: string;
  project: ProjectItem;
  issue: IssueItem;
  details: RequestDetailItem[];
  created: string;
  updated: string;
  createdBy: EmployeeItem;
  updatedBy: EmployeeItem;
};

export type RequestListItem = {
  id: string;
  project?: ProjectItem;
  issue?: IssueItem;
  details?: RequestDetailItem[];
  created?: string;
  updated?: string;
};

export type RequestDetailItem = {
  id: string;
  detail: DetailItem;
  requestVolume: number;
  customLevel: string;
  customTitle: string;
  customUnit: string;
  index: string;
  note: string;
  deliveryDate: string;
  created: string;
  updated: string;
  createdBy: EmployeeItem;
  updatedBy: EmployeeItem;
};

export type RequestListResponse = PaginatedResponse<RequestListItem>;
