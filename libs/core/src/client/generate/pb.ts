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
	IssueFile = "issueFile",
	IssueUserInfo = "issueUserInfo",
	Material = "material",
	Price = "price",
	PriceDetail = "priceDetail",
	Process = "process",
	Project = "project",
	Request = "request",
	RequestDetail = "requestDetail",
	RequestDetailInfo = "requestDetailInfo",
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
	project: RecordIdString
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
	issueCode?: string
	issueTitle: string
	level: string
	note?: string
	parent?: string
	project: RecordIdString
	request: RecordIdString
	requestVolume?: number
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
export type IssueRecord<Tapprover = unknown, TlastAssignee = unknown> = {
	approver?: null | Tapprover
	assignee?: RecordIdString
	changed?: IsoDateString
	code?: string
	createdBy?: RecordIdString
	deadlineStatus?: IssueDeadlineStatusOptions
	deleted?: boolean
	endDate?: IsoDateString
	lastAssignee?: null | TlastAssignee
	project: RecordIdString
	startDate?: IsoDateString
	status?: string
	title: string
	type: IssueTypeOptions
}

export type IssueFileRecord = {
	issue?: RecordIdString
	name?: string
	size?: number
	type?: string
	upload?: string
}

export type IssueUserInfoRecord = {
	count?: number
	project: RecordIdString
	user?: RecordIdString
}

export type MaterialRecord = {
	code?: string
	name?: string
	note?: string
	unit?: string
}

export type PriceRecord = {
	issue: RecordIdString
	project: RecordIdString
}

export type PriceDetailRecord<Tprices = unknown> = {
	estimateAmount?: number
	estimatePrice?: number
	index?: string
	level?: string
	price: RecordIdString
	prices?: null | Tprices
	title?: string
	unit?: string
	volume?: number
}

export enum ProcessTypeOptions {
	"Request" = "Request",
	"Price" = "Price",
}
export type ProcessRecord<Tprocess = unknown> = {
	done: string
	process?: null | Tprocess
	type: ProcessTypeOptions
}

export type ProjectRecord = {
	bidding?: string
	createdBy?: RecordIdString
	customer?: RecordIdString
	name?: string
}

export type RequestRecord = {
	issue: RecordIdString
	project: RecordIdString
}

export type RequestDetailRecord = {
	customLevel?: string
	customTitle?: string
	customUnit?: string
	deliveryDate?: IsoDateString
	detail?: RecordIdString
	index?: string
	note?: string
	request: RecordIdString
	requestVolume?: number
}

export type RequestDetailInfoRecord = {
	deleted?: boolean
	detail?: RecordIdString
	request: RecordIdString
	requestVolume?: number
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
export type IssueResponse<Tapprover = unknown, TlastAssignee = unknown, Texpand = unknown> = Required<IssueRecord<Tapprover, TlastAssignee>> & BaseSystemFields<Texpand>
export type IssueFileResponse<Texpand = unknown> = Required<IssueFileRecord> & BaseSystemFields<Texpand>
export type IssueUserInfoResponse<Texpand = unknown> = Required<IssueUserInfoRecord> & BaseSystemFields<Texpand>
export type MaterialResponse<Texpand = unknown> = Required<MaterialRecord> & BaseSystemFields<Texpand>
export type PriceResponse<Texpand = unknown> = Required<PriceRecord> & BaseSystemFields<Texpand>
export type PriceDetailResponse<Tprices = unknown, Texpand = unknown> = Required<PriceDetailRecord<Tprices>> & BaseSystemFields<Texpand>
export type ProcessResponse<Tprocess = unknown, Texpand = unknown> = Required<ProcessRecord<Tprocess>> & BaseSystemFields<Texpand>
export type ProjectResponse<Texpand = unknown> = Required<ProjectRecord> & BaseSystemFields<Texpand>
export type RequestResponse<Texpand = unknown> = Required<RequestRecord> & BaseSystemFields<Texpand>
export type RequestDetailResponse<Texpand = unknown> = Required<RequestDetailRecord> & BaseSystemFields<Texpand>
export type RequestDetailInfoResponse<Texpand = unknown> = Required<RequestDetailInfoRecord> & BaseSystemFields<Texpand>
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
	issueFile: IssueFileRecord
	issueUserInfo: IssueUserInfoRecord
	material: MaterialRecord
	price: PriceRecord
	priceDetail: PriceDetailRecord
	process: ProcessRecord
	project: ProjectRecord
	request: RequestRecord
	requestDetail: RequestDetailRecord
	requestDetailInfo: RequestDetailInfoRecord
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
	issueFile: IssueFileResponse
	issueUserInfo: IssueUserInfoResponse
	material: MaterialResponse
	price: PriceResponse
	priceDetail: PriceDetailResponse
	process: ProcessResponse
	project: ProjectResponse
	request: RequestResponse
	requestDetail: RequestDetailResponse
	requestDetailInfo: RequestDetailInfoResponse
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
	collection(idOrName: 'issueFile'): RecordService<IssueFileResponse>
	collection(idOrName: 'issueUserInfo'): RecordService<IssueUserInfoResponse>
	collection(idOrName: 'material'): RecordService<MaterialResponse>
	collection(idOrName: 'price'): RecordService<PriceResponse>
	collection(idOrName: 'priceDetail'): RecordService<PriceDetailResponse>
	collection(idOrName: 'process'): RecordService<ProcessResponse>
	collection(idOrName: 'project'): RecordService<ProjectResponse>
	collection(idOrName: 'request'): RecordService<RequestResponse>
	collection(idOrName: 'requestDetail'): RecordService<RequestDetailResponse>
	collection(idOrName: 'requestDetailInfo'): RecordService<RequestDetailInfoResponse>
	collection(idOrName: 'supplier'): RecordService<SupplierResponse>
	collection(idOrName: 'template'): RecordService<TemplateResponse>
	collection(idOrName: 'user'): RecordService<UserResponse>
}
