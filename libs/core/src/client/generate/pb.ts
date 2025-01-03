/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Column = "column",
	Comment = "comment",
	Contract = "contract",
	Customer = "customer",
	Department = "department",
	Detail = "detail",
	DetailImport = "detailImport",
	DetailInfo = "detailInfo",
	Issue = "issue",
	Material = "material",
	Project = "project",
	Request = "request",
	RequestConfirm = "requestConfirm",
	RequestDetail = "requestDetail",
	RequestDetailInfo = "requestDetailInfo",
	RequestDetailSupplier = "requestDetailSupplier",
	RequestDetailSupplierInfo = "requestDetailSupplierInfo",
	RequestUserInfo = "requestUserInfo",
	Setting = "setting",
	Supplier = "supplier",
	Template = "template",
	User = "user",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum ColumnTypeOptions {
	"Numeric" = "Numeric",
	"Text" = "Text",
}
export type ColumnRecord = {
	project: RecordIdString
	title: string
	type: ColumnTypeOptions
}

export type CommentRecord = {
	content?: string
	createdBy: RecordIdString
	issue: RecordIdString
	status?: string
}

export type ContractRecord = {
	count?: number
	note?: string
	request: RecordIdString
	supplier: RecordIdString
}

export type CustomerRecord = {
	address?: string
	code?: string
	email?: string
	name: string
	note?: string
	phone?: string
}

export type DepartmentRecord = {
	code?: string
	description?: string
	name: string
}

export type DetailRecord<Textend = unknown> = {
	extend?: null | Textend
	level: string
	note?: string
	parent?: string
	project?: RecordIdString
	title: string
	unit?: string
	unitPrice?: number
	volume?: number
}

export enum DetailImportStatusOptions {
	"Working" = "Working",
	"Done" = "Done",
	"Error" = "Error",
}
export type DetailImportRecord = {
	error?: string
	file?: string
	percent?: number
	project?: RecordIdString
	status?: DetailImportStatusOptions
}

export type DetailInfoRecord<Textend = unknown> = {
	extend?: null | Textend
	group?: RecordIdString
	issue?: RecordIdString
	issueTitle?: string
	level: string
	note?: string
	parent?: string
	price?: number
	project?: RecordIdString
	request: RecordIdString
	requestVolume?: number
	supplier?: RecordIdString
	supplierName: string
	title: string
	unit?: string
	unitPrice?: number
	volume?: number
}

export enum IssueTypeOptions {
	"Request" = "Request",
	"Price" = "Price",
	"Contract" = "Contract",
}

export enum IssueDeadlineStatusOptions {
	"Normal" = "Normal",
	"Warning" = "Warning",
	"Danger" = "Danger",
}

export enum IssueStatusOptions {
	"Working" = "Working",
	"Done" = "Done",
}
export type IssueRecord<TlastAssignee = unknown> = {
	assignee?: RecordIdString
	changed?: IsoDateString
	createdBy?: RecordIdString
	deadlineStatus?: IssueDeadlineStatusOptions
	deleted?: boolean
	endDate?: IsoDateString
	lastAssignee?: null | TlastAssignee
	project: RecordIdString
	startDate?: IsoDateString
	status?: IssueStatusOptions
	title?: string
	type?: IssueTypeOptions
}

export type MaterialRecord = {
	code?: string
	name?: string
	note?: string
	unit?: string
}

export type ProjectRecord = {
	bidding?: string
	createdBy?: RecordIdString
	customer?: RecordIdString
	name?: string
}

export enum RequestStatusOptions {
	"A1" = "A1",
	"A1F" = "A1F",
	"A1R" = "A1R",
	"A2F" = "A2F",
	"A2R" = "A2R",
	"A3F" = "A3F",
	"A3R" = "A3R",
	"A4F" = "A4F",
	"A4R" = "A4R",
	"A5F" = "A5F",
	"A5R" = "A5R",
	"A6F" = "A6F",
	"A6R" = "A6R",
	"A7F" = "A7F",
	"A7R" = "A7R",
	"A8" = "A8",
	"A8R" = "A8R",
}
export type RequestRecord = {
	code?: string
	confirm1?: string
	confirm1Date?: IsoDateString
	confirm2?: string
	confirm2Date?: IsoDateString
	confirm3?: string
	confirm3Date?: IsoDateString
	issue: RecordIdString
	project: RecordIdString
	status?: RequestStatusOptions
}

export type RequestConfirmRecord = {
	confirmer?: RecordIdString
	request?: RecordIdString
}

export type RequestDetailRecord = {
	customLevel?: string
	customTitle?: string
	customUnit?: string
	deliveryDate?: IsoDateString
	detail?: RecordIdString
	index?: string
	note?: string
	price?: number
	request: RecordIdString
	supplier?: RecordIdString
	volume?: number
}

export type RequestDetailInfoRecord = {
	deleted?: boolean
	detail?: RecordIdString
	request: RecordIdString
	volume?: number
}

export type RequestDetailSupplierRecord = {
	price?: number
	requestDetail: RecordIdString
	supplier: RecordIdString
	volume?: number
}

export type RequestDetailSupplierInfoRecord = {
	price?: number
	request?: RecordIdString
	supplier?: RecordIdString
}

export type RequestUserInfoRecord = {
	assignee?: RecordIdString
	count?: number
	p: RecordIdString
}

export enum SettingTypeOptions {
	"Confirmer" = "Confirmer",
	"Approver" = "Approver",
}
export type SettingRecord = {
	type?: SettingTypeOptions
	user?: RecordIdString
}

export type SupplierRecord = {
	address?: string
	code?: string
	email?: string
	name: string
	note?: string
	phone?: string
}

export type TemplateRecord = {
	detail?: string
}

export type UserRecord = {
	avatar?: string
	department: RecordIdString
	displayEmail?: string
	name: string
	phone?: string
	role?: number
	title?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ColumnResponse<Texpand = unknown> = Required<ColumnRecord> & BaseSystemFields<Texpand>
export type CommentResponse<Texpand = unknown> = Required<CommentRecord> & BaseSystemFields<Texpand>
export type ContractResponse<Texpand = unknown> = Required<ContractRecord> & BaseSystemFields<Texpand>
export type CustomerResponse<Texpand = unknown> = Required<CustomerRecord> & BaseSystemFields<Texpand>
export type DepartmentResponse<Texpand = unknown> = Required<DepartmentRecord> & BaseSystemFields<Texpand>
export type DetailResponse<Textend = unknown, Texpand = unknown> = Required<DetailRecord<Textend>> & BaseSystemFields<Texpand>
export type DetailImportResponse<Texpand = unknown> = Required<DetailImportRecord> & BaseSystemFields<Texpand>
export type DetailInfoResponse<Textend = unknown, Texpand = unknown> = Required<DetailInfoRecord<Textend>> & BaseSystemFields<Texpand>
export type IssueResponse<TlastAssignee = unknown, Texpand = unknown> = Required<IssueRecord<TlastAssignee>> & BaseSystemFields<Texpand>
export type MaterialResponse<Texpand = unknown> = Required<MaterialRecord> & BaseSystemFields<Texpand>
export type ProjectResponse<Texpand = unknown> = Required<ProjectRecord> & BaseSystemFields<Texpand>
export type RequestResponse<Texpand = unknown> = Required<RequestRecord> & BaseSystemFields<Texpand>
export type RequestConfirmResponse<Texpand = unknown> = Required<RequestConfirmRecord> & BaseSystemFields<Texpand>
export type RequestDetailResponse<Texpand = unknown> = Required<RequestDetailRecord> & BaseSystemFields<Texpand>
export type RequestDetailInfoResponse<Texpand = unknown> = Required<RequestDetailInfoRecord> & BaseSystemFields<Texpand>
export type RequestDetailSupplierResponse<Texpand = unknown> = Required<RequestDetailSupplierRecord> & BaseSystemFields<Texpand>
export type RequestDetailSupplierInfoResponse<Texpand = unknown> = Required<RequestDetailSupplierInfoRecord> & BaseSystemFields<Texpand>
export type RequestUserInfoResponse<Texpand = unknown> = Required<RequestUserInfoRecord> & BaseSystemFields<Texpand>
export type SettingResponse<Texpand = unknown> = Required<SettingRecord> & BaseSystemFields<Texpand>
export type SupplierResponse<Texpand = unknown> = Required<SupplierRecord> & BaseSystemFields<Texpand>
export type TemplateResponse<Texpand = unknown> = Required<TemplateRecord> & BaseSystemFields<Texpand>
export type UserResponse<Texpand = unknown> = Required<UserRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	column: ColumnRecord
	comment: CommentRecord
	contract: ContractRecord
	customer: CustomerRecord
	department: DepartmentRecord
	detail: DetailRecord
	detailImport: DetailImportRecord
	detailInfo: DetailInfoRecord
	issue: IssueRecord
	material: MaterialRecord
	project: ProjectRecord
	request: RequestRecord
	requestConfirm: RequestConfirmRecord
	requestDetail: RequestDetailRecord
	requestDetailInfo: RequestDetailInfoRecord
	requestDetailSupplier: RequestDetailSupplierRecord
	requestDetailSupplierInfo: RequestDetailSupplierInfoRecord
	requestUserInfo: RequestUserInfoRecord
	setting: SettingRecord
	supplier: SupplierRecord
	template: TemplateRecord
	user: UserRecord
}

export type CollectionResponses = {
	column: ColumnResponse
	comment: CommentResponse
	contract: ContractResponse
	customer: CustomerResponse
	department: DepartmentResponse
	detail: DetailResponse
	detailImport: DetailImportResponse
	detailInfo: DetailInfoResponse
	issue: IssueResponse
	material: MaterialResponse
	project: ProjectResponse
	request: RequestResponse
	requestConfirm: RequestConfirmResponse
	requestDetail: RequestDetailResponse
	requestDetailInfo: RequestDetailInfoResponse
	requestDetailSupplier: RequestDetailSupplierResponse
	requestDetailSupplierInfo: RequestDetailSupplierInfoResponse
	requestUserInfo: RequestUserInfoResponse
	setting: SettingResponse
	supplier: SupplierResponse
	template: TemplateResponse
	user: UserResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'column'): RecordService<ColumnResponse>
	collection(idOrName: 'comment'): RecordService<CommentResponse>
	collection(idOrName: 'contract'): RecordService<ContractResponse>
	collection(idOrName: 'customer'): RecordService<CustomerResponse>
	collection(idOrName: 'department'): RecordService<DepartmentResponse>
	collection(idOrName: 'detail'): RecordService<DetailResponse>
	collection(idOrName: 'detailImport'): RecordService<DetailImportResponse>
	collection(idOrName: 'detailInfo'): RecordService<DetailInfoResponse>
	collection(idOrName: 'issue'): RecordService<IssueResponse>
	collection(idOrName: 'material'): RecordService<MaterialResponse>
	collection(idOrName: 'project'): RecordService<ProjectResponse>
	collection(idOrName: 'request'): RecordService<RequestResponse>
	collection(idOrName: 'requestConfirm'): RecordService<RequestConfirmResponse>
	collection(idOrName: 'requestDetail'): RecordService<RequestDetailResponse>
	collection(idOrName: 'requestDetailInfo'): RecordService<RequestDetailInfoResponse>
	collection(idOrName: 'requestDetailSupplier'): RecordService<RequestDetailSupplierResponse>
	collection(idOrName: 'requestDetailSupplierInfo'): RecordService<RequestDetailSupplierInfoResponse>
	collection(idOrName: 'requestUserInfo'): RecordService<RequestUserInfoResponse>
	collection(idOrName: 'setting'): RecordService<SettingResponse>
	collection(idOrName: 'supplier'): RecordService<SupplierResponse>
	collection(idOrName: 'template'): RecordService<TemplateResponse>
	collection(idOrName: 'user'): RecordService<UserResponse>
}
