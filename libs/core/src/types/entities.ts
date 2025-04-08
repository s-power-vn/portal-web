/**
 * Base entity type with common fields
 */
export type BaseEntity = {
  id: string;
  created?: string;
  updated?: string;
  created_by?: string;
  updated_by?: string;
};

/**
 * Comment entity
 */
export type Comment = BaseEntity & {
  content: string;
  issue_id?: string;
  status?: string;
  organization_id?: string;
};

/**
 * Contract entity
 */
export type Contract = BaseEntity & {
  request_id?: string;
  supplier_id?: string;
  count?: number;
  note?: string;
  organization_id?: string;
};

/**
 * Customer entity
 */
export type Customer = BaseEntity & {
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  organization_id?: string;
};

/**
 * Department entity
 */
export type Department = BaseEntity & {
  name: string;
  description?: string;
  roles?: {
    id: string;
    name: string;
  }[];
  organization_id?: string;
};

/**
 * Detail entity
 */
export type Detail = BaseEntity & {
  title: string;
  unit?: string;
  level?: string;
  parent_id?: string;
  project_id?: string;
  note?: string;
  unit_price?: number;
  volume?: number;
  extend?: Record<string, unknown>;
  organization_id?: string;
};

/**
 * DetailInfo entity
 */
export type DetailInfo = {
  group_id?: string;
  project_id?: string;
  created?: string;
  updated?: string;
  title?: string;
  volume?: number;
  level?: string;
  unit?: string;
  unit_price?: number;
  parent_id?: string;
  note?: string;
  extend?: Record<string, unknown>;
  request_id?: string;
  request_volume?: number;
  issue_title?: string;
  issue_id?: string;
  issue_code?: string;
  organization_id?: string;
};

/**
 * DetailImport entity
 */
export type DetailImport = BaseEntity & {
  file: string;
  status?: string;
  error?: string;
  percent?: number;
  project_id?: string;
  organization_id?: string;
};

/**
 * Issue entity
 */
export type Issue = BaseEntity & {
  title: string;
  code?: string;
  content?: string;
  project_id?: string;
  object_id?: string;
  status?: string;
  deadline_status?: string;
  start_date?: string;
  end_date?: string;
  changed?: string;
  last_assignee?: Record<string, unknown>;
  approver?: Record<string, unknown>;
  assignees?: Record<string, unknown>;
  assigned_date?: string;
  deleted?: boolean;
  organization_id?: string;
};

/**
 * IssueFile entity
 */
export type IssueFile = BaseEntity & {
  name: string;
  upload: string;
  size?: number;
  type?: string;
  issue_id?: string;
  organization_id?: string;
};

/**
 * IssueUserInfo entity
 */
export type IssueUserInfo = {
  user_id?: string;
  project_id?: string;
  organization_id?: string;
  count?: number;
};

/**
 * Material entity
 */
export type Material = BaseEntity & {
  name: string;
  code?: string;
  unit?: string;
  note?: string;
  organization_id?: string;
};

/**
 * ObjectType entity
 */
export type ObjectType = BaseEntity & {
  name: string;
  display?: string;
  description?: string;
  color?: string;
  icon?: string;
  organization_id?: string;
};

/**
 * Object entity
 */
export type Object = BaseEntity & {
  name: string;
  object_type_id?: string;
  process_id?: string;
  description?: string;
  active?: boolean;
  organization_id?: string;
};

/**
 * Organization entity
 */
export type Organization = BaseEntity & {
  name: string;
  settings?: Record<string, unknown>;
};

/**
 * OrganizationMember entity
 */
export type OrganizationMember = BaseEntity & {
  organization_id?: string;
  user_id?: string;
  name?: string;
  department_id?: string;
  department_role?: string;
  department_title?: string;
  role: string;
};

/**
 * Price entity
 */
export type Price = BaseEntity & {
  issue_id?: string;
  project_id?: string;
  organization_id?: string;
};

/**
 * PriceDetail entity
 */
export type PriceDetail = BaseEntity & {
  price_id?: string;
  title: string;
  estimate_price?: number;
  index?: string;
  level?: string;
  unit?: string;
  volume?: number;
  prices?: Record<string, unknown>;
  estimate_amount?: number;
  organization_id?: string;
};

/**
 * Process entity
 */
export type Process = BaseEntity & {
  name: string;
  process?: Record<string, unknown>;
  finish_node?: string;
  description?: string;
  object_type_id?: string;
  start_node?: string;
  organization_id?: string;
};

/**
 * Project entity
 */
export type Project = BaseEntity & {
  name: string;
  bidding?: string;
  customer_id?: string;
  organization_id?: string;
};

/**
 * Request entity
 */
export type Request = BaseEntity & {
  issue_id?: string;
  project_id?: string;
  organization_id?: string;
};

/**
 * RequestDetail entity
 */
export type RequestDetail = BaseEntity & {
  request_id?: string;
  detail_id?: string;
  request_volume?: number;
  custom_level?: string;
  custom_title?: string;
  custom_unit?: string;
  index?: string;
  note?: string;
  delivery_date?: string;
  organization_id?: string;
};

/**
 * RequestDetailInfo entity
 */
export type RequestDetailInfo = {
  id?: string;
  detail_id?: string;
  request_volume?: number;
  request_id?: string;
  deleted?: boolean;
  organization_id?: string;
};

/**
 * RequestFinished entity
 */
export type RequestFinished = {
  issue_id?: string;
  request_id?: string;
  project_id?: string;
  title?: string;
  changed?: string;
  organization_id?: string;
};

/**
 * Supplier entity
 */
export type Supplier = BaseEntity & {
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  organization_id?: string;
};

/**
 * Template entity
 */
export type Template = BaseEntity & {
  detail_id?: string;
  organization_id?: string;
};

/**
 * User entity
 */
export type User = BaseEntity & {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
};

/**
 * Message related entities
 */
export type MsgChannel = BaseEntity & {
  name: string;
  team_id?: string;
  description?: string;
  organization_id?: string;
};

export type MsgChat = BaseEntity & {
  type: string;
  participants?: Record<string, unknown>;
  organization_id?: string;
};

export type MsgMessage = BaseEntity & {
  content: string;
  chat_id?: string;
  sender_id?: string;
  type?: string;
  reply_to_id?: string;
  organization_id?: string;
};

export type MsgReaction = BaseEntity & {
  reaction: string;
  message_id?: string;
  user_id?: string;
  organization_id?: string;
};

export type MsgSetting = BaseEntity & {
  user_id?: string;
  chat_id?: string;
  last_read?: string;
  organization_id?: string;
};

export type MsgTeam = BaseEntity & {
  name: string;
  owner?: string;
  members?: Record<string, unknown>;
  organization_id?: string;
};

/**
 * MsgUnread entity
 */
export type MsgUnread = {
  chat_id?: string;
  chat_type?: string;
  user_id?: string;
  organization_id?: string;
  unread_count?: number;
};
