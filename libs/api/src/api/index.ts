import { authApi } from './auth';
import { commentApi } from './comment';
import { customerApi } from './customer';
import { departmentApi } from './department';
import { detailApi, detailImportApi, detailInfoApi } from './detail';
import type { UserData } from './employee';
import { employeeApi } from './employee';
import { issueApi } from './issue';
import { materialApi } from './material';
import type { ProjectData } from './project';
import { projectApi } from './project';
import type { RequestData, RequestDetailData } from './request';
import { requestApi, requestDetailApi } from './request';
import { settingApi } from './setting';
import { supplierApi } from './supplier';
import { SearchSchema } from './types';
import { userApi } from './user';

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
  project: projectApi,
  request: requestApi,
  requestDetail: requestDetailApi,
  setting: settingApi,
  supplier: supplierApi,
  user: userApi
};

export { RequestData, RequestDetailData, UserData, ProjectData, SearchSchema };
