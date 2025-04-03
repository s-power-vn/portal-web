/**
 * Base entity type with common fields
 */
export type BaseEntity = {
  id: string;
  created?: string;
  updated?: string;
};

/**
 * Comment entity
 */
export type Comment = BaseEntity & {
  content: string;
  created_by?: string;
  issue?: string;
};

/**
 * Contract entity
 */
export type Contract = BaseEntity & {
  name: string;
  project?: string;
  content?: string;
  organization_id?: string;
};

/**
 * Customer entity
 */
export type Customer = BaseEntity & {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  organization_id?: string;
};

/**
 * Department entity
 */
export type Department = BaseEntity & {
  name: string;
  description?: string;
  roles?: Record<string, unknown>;
  organization_id?: string;
};

/**
 * Detail entity
 */
export type Detail = BaseEntity & {
  title: string;
  unit?: string;
  level?: string;
  parent?: string;
  organization_id?: string;
};

/**
 * DetailImport entity
 */
export type DetailImport = BaseEntity & {
  file: string;
  status?: string;
  organization_id?: string;
};

/**
 * Issue entity
 */
export type Issue = BaseEntity & {
  title: string;
  code?: string;
  content?: string;
  project?: string;
  object?: string;
  created_by?: string;
  organization_id?: string;
};

/**
 * IssueFile entity
 */
export type IssueFile = BaseEntity & {
  name: string;
  file: string;
  issue?: string;
};

/**
 * Material entity
 */
export type Material = BaseEntity & {
  name: string;
  code?: string;
  unit?: string;
  organization_id?: string;
};

/**
 * ObjectType entity
 */
export type ObjectType = BaseEntity & {
  name: string;
  display?: string;
  organization_id?: string;
};

/**
 * Object entity
 */
export type Object = BaseEntity & {
  name: string;
  type?: string;
  process?: string;
  organization_id?: string;
};

/**
 * Organization entity
 */
export type Organization = BaseEntity & {
  name: string;
  settings?: Record<string, unknown>;
  created_by?: string;
};

/**
 * OrganizationMember entity
 */
export type OrganizationMember = BaseEntity & {
  organization_id?: string;
  user_id?: string;
  department?: string;
  role: string;
};

/**
 * Price entity
 */
export type Price = BaseEntity & {
  issue?: string;
  project?: string;
  organization_id?: string;
};

/**
 * PriceDetail entity
 */
export type PriceDetail = BaseEntity & {
  price?: string;
  detail?: string;
  quantity?: number;
  unit_price?: number;
};

/**
 * Process entity
 */
export type Process = BaseEntity & {
  name: string;
  process?: Record<string, unknown>;
  organization_id?: string;
};

/**
 * Project entity
 */
export type Project = BaseEntity & {
  name: string;
  bidding?: string;
  created_by?: string;
  customer?: string;
  organization_id?: string;
};

/**
 * Request entity
 */
export type Request = BaseEntity & {
  issue?: string;
  project?: string;
  organization_id?: string;
};

/**
 * RequestDetail entity
 */
export type RequestDetail = BaseEntity & {
  request?: string;
  detail?: string;
  quantity?: number;
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
  name: string;
  content?: string;
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
  type?: string;
  team?: string;
};

export type MsgChat = BaseEntity & {
  type?: string;
  channel?: string;
  team?: string;
};

export type MsgMessage = BaseEntity & {
  content: string;
  chat?: string;
  sender?: string;
};

export type MsgReaction = BaseEntity & {
  emoji: string;
  message?: string;
  user?: string;
};

export type MsgSetting = BaseEntity & {
  user?: string;
  chat?: string;
  muted?: boolean;
};

export type MsgTeam = BaseEntity & {
  name: string;
  owner?: string;
  organization_id?: string;
};
