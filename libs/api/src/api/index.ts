import { authApi } from './auth';
import { commentApi } from './domain/comment';
import { detailApi, detailImportApi, detailInfoApi } from './domain/detail';
import { IssueData, issueApi } from './domain/issue/issue';
import { organizationApi } from './domain/organization/organization';
import { priceApi } from './domain/price';
import { projectApi } from './domain/project/project';
import type { RequestData, RequestDetailData } from './domain/request';
import { requestApi } from './domain/request';
import { userApi } from './domain/user/user';
import {
  MsgChannel,
  MsgChat,
  MsgMessage,
  MsgReaction,
  MsgSetting,
  MsgTeam,
  chatApi
} from './messenger/chat';
import { customerApi } from './setting/general/customer/customer';
import { departmentApi } from './setting/general/department/department';
import { employeeApi } from './setting/general/employee/employee';
import { materialApi } from './setting/general/material/material';
import { supplierApi } from './setting/general/supplier/supplier';
import { objectTypeApi } from './setting/operation/object-type/object-type';
import { objectApi } from './setting/operation/object/object';
import { processApi } from './setting/operation/process/process';
import { ListSchema } from './types';

export const api = {
  auth: authApi,
  chat: chatApi,
  comment: commentApi,
  customer: customerApi,
  department: departmentApi,
  detail: detailApi,
  detailInfo: detailInfoApi,
  detailImport: detailImportApi,
  employee: employeeApi,
  issue: issueApi,
  material: materialApi,
  object: objectApi,
  objectType: objectTypeApi,
  organization: organizationApi,
  price: priceApi,
  process: processApi,
  project: projectApi,
  request: requestApi,
  supplier: supplierApi,
  user: userApi
};

export type {
  IssueData,
  MsgChannel,
  MsgChat,
  MsgMessage,
  MsgReaction,
  MsgSetting,
  MsgTeam,
  RequestData,
  RequestDetailData
};

export { ListSchema };

export * from './domain';
export * from './messenger/chat';
export * from './setting/general';
export * from './setting/operation';
