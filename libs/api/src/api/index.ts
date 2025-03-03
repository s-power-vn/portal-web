import { authApi } from './auth';
import { commentApi } from './domain/comment';
import { detailApi, detailImportApi, detailInfoApi } from './domain/detail';
import { IssueData, issueApi } from './domain/issue';
import { priceApi } from './domain/price';
import type { ProjectData } from './domain/project';
import { projectApi } from './domain/project';
import type { RequestData, RequestDetailData } from './domain/request';
import { requestApi, requestDetailApi } from './domain/request';
import { userApi } from './domain/user';
import { customerApi } from './setting/general/customer';
import { DepartmentData, departmentApi } from './setting/general/department';
import type { UserData } from './setting/general/employee';
import { employeeApi } from './setting/general/employee';
import { materialApi } from './setting/general/material';
import { supplierApi } from './setting/general/supplier';
import { ObjectData, objectApi } from './setting/operation/object';
import { ProcessDbData, processApi } from './setting/operation/process';
import { ListSchema } from './types';

export const api = {
  auth: authApi,
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
  price: priceApi,
  process: processApi,
  project: projectApi,
  request: requestApi,
  requestDetail: requestDetailApi,
  supplier: supplierApi,
  user: userApi
};

export type {
  DepartmentData,
  IssueData,
  ObjectData,
  ProcessDbData,
  ProjectData,
  RequestData,
  RequestDetailData,
  UserData
};

export { ListSchema };
