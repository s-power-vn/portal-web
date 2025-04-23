import { Json } from 'portal-core';

import { EmployeeItem } from '../../setting/general';
import { DetailItem } from '../detail/detail.type';
import { ProjectItem } from '../project/project.type';

export type DetailInfoListItem = {
  id: string;
  title: string;
  note?: string;
  parent?: DetailItem;
  project?: ProjectItem;
  volume?: number;
  unit?: string;
  unitPrice?: number;
  level?: string;
  extend?: Json;
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type DetailInfoFullListResponse = DetailInfoListItem[];
