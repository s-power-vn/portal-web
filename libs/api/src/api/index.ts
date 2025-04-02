import { authApi } from './auth';
import { commentApi } from './domain/comment';
import { detailApi, detailImportApi, detailInfoApi } from './domain/detail';
import { IssueData, issueApi } from './domain/issue';
import { organizationApi } from './domain/organization';
import { priceApi } from './domain/price';
import type { ProjectData } from './domain/project';
import { projectApi } from './domain/project';
import type { RequestData, RequestDetailData } from './domain/request';
import { requestApi } from './domain/request';
import { userApi } from './domain/user';
import {
  MsgChannel,
  MsgChat,
  MsgMessage,
  MsgReaction,
  MsgSetting,
  MsgTeam,
  chatApi
} from './messenger/chat';
import { customerApi } from './setting/general/customer';
import { DepartmentData, departmentApi } from './setting/general/department';
import type { UserData } from './setting/general/employee';
import { employeeApi } from './setting/general/employee';
import { materialApi } from './setting/general/material';
import { supplierApi } from './setting/general/supplier';
import { ObjectData, objectApi } from './setting/operation/object';
import { ObjectTypeData, objectTypeApi } from './setting/operation/objectType';
import { ProcessDbData, processApi } from './setting/operation/process';
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
  DepartmentData,
  IssueData,
  MsgChannel,
  MsgChat,
  MsgMessage,
  MsgReaction,
  MsgSetting,
  MsgTeam,
  ObjectData,
  ObjectTypeData,
  ProcessDbData,
  ProjectData,
  RequestData,
  RequestDetailData,
  UserData
};

export { ListSchema };

export * from './messenger/chat';
