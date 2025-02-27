import { authApi } from './auth';
import { commentApi } from './comment';
import { customerApi } from './customer';
import { departmentApi } from './department';
import { detailApi, detailImportApi, detailInfoApi } from './detail';
import type { UserData } from './employee';
import { employeeApi } from './employee';
import { issueApi } from './issue';
import { materialApi } from './material';
import { objectApi } from './object';
import { priceApi } from './price';
import { processApi } from './process';
import type { ProjectData } from './project';
import { projectApi } from './project';
import type { RequestData, RequestDetailData } from './request';
import { requestApi, requestDetailApi } from './request';
import { supplierApi } from './supplier';
import { ListSchema } from './types';
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
  object: objectApi,
  price: priceApi,
  process: processApi,
  project: projectApi,
  request: requestApi,
  requestDetail: requestDetailApi,
  supplier: supplierApi,
  user: userApi
};

export type { ProjectData, RequestData, RequestDetailData, UserData };

export { ListSchema };
