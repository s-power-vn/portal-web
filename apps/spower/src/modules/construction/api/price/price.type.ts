import { EmployeeItem, IssueItem } from 'portal-api';

export type PriceDetailItem = {
  id: string;
  level?: string;
  index?: string;
  requestVolume?: number;
  title?: string;
  note?: string;
  unit?: string;
  prices?: {
    [key: string]: number;
  };
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type PriceItem = {
  id: string;
  issue?: IssueItem;
  details?: PriceDetailItem[];
  created?: string;
  updated?: string;
  createdBy?: EmployeeItem;
  updatedBy?: EmployeeItem;
};

export type CreatePriceInput = {
  title: string;
  project: string;
  object: string;
  code: string;
  startDate?: Date;
  endDate?: Date;
  details?: {
    estimate?: number;
    index?: string;
    level?: string;
    title?: string;
    unit?: string;
    volume?: number;
    prices?: {
      [key: string]: number;
    };
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

export type UpdatePriceInput = {
  id: string;
  title: string;
  project: string;
  code: string;
  startDate?: Date;
  endDate?: Date;
  details?: {
    estimate?: number;
    index?: string;
    level?: string;
    title?: string;
    unit?: string;
    volume?: number;
    prices?: {
      [key: string]: number;
    };
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
