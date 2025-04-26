import { EmployeeItem } from '../../setting/general';

export type IssueCommentItem = {
  id: string;
  content: string;
  created: string;
  updated: string;
  createdBy: EmployeeItem;
  updatedBy: EmployeeItem;
};

export type IssueCommentListItem = {
  id: string;
  content: string;
  created: string;
  updated: string;
  createdBy: EmployeeItem;
  updatedBy: EmployeeItem;
};

export type IssueCommentListFullResponse = IssueCommentListItem[];

export type CreateIssueCommentInput = {
  content: string;
  issueId: string;
};
