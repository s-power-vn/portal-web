/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Contract = "contract",
	Customer = "customer",
	Department = "department",
	Detail = "detail",
	DetailInfo = "detailInfo",
	Issue = "issue",
	Project = "project",
	Request = "request",
	RequestDetail = "requestDetail",
	RequestDetailSupplier = "requestDetailSupplier",
	Supplier = "supplier",
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

export type DetailRecord = {
	document: RecordIdString
	level: string
	note?: string
	parent?: string
	title: string
	unit?: string
	unitPrice?: number
	volume?: number
}

export type DetailInfoRecord = {
	document: RecordIdString
	group?: RecordIdString
	level: string
	note?: string
	parent?: string
	request: RecordIdString
	requestVolume?: number
	supplierName: string
	supplierPrice?: number
	supplierVolume?: number
	title: string
	unit?: string
	unitPrice?: number
	volume?: number
}

export enum IssueTypeOptions {
	"Request" = "Request",
	"Contract" = "Contract",
	"Delivery" = "Delivery",
}
export type IssueRecord = {
	assignee?: RecordIdString
	createdBy?: RecordIdString
	deleted?: boolean
	project: RecordIdString
	title?: string
	type?: IssueTypeOptions
}

export type ProjectRecord = {
	bidding?: string
	createdBy?: RecordIdString
	customer?: RecordIdString
	name?: string
}

export enum RequestStatusOptions {
	"ToDo" = "ToDo",
	"Done" = "Done",
}
export type RequestRecord = {
	issue: RecordIdString
	project: RecordIdString
	status?: RequestStatusOptions
}

export type RequestDetailRecord = {
	detail?: RecordIdString
	request: RecordIdString
	volume?: number
}

export enum RequestDetailSupplierStatusOptions {
	"ToDo" = "ToDo",
	"Done" = "Done",
}
export type RequestDetailSupplierRecord = {
	price?: number
	requestDetail: RecordIdString
	status?: RequestDetailSupplierStatusOptions
	supplier: RecordIdString
	volume?: number
}

export type SupplierRecord = {
	address?: string
	code?: string
	email?: string
	name: string
	note?: string
	phone?: string
}

export type UserRecord = {
	avatar?: string
	department: RecordIdString
	name: string
}

// Response types include system fields and match responses from the PocketBase API
export type ContractResponse<Texpand = unknown> = Required<ContractRecord> & BaseSystemFields<Texpand>
export type CustomerResponse<Texpand = unknown> = Required<CustomerRecord> & BaseSystemFields<Texpand>
export type DepartmentResponse<Texpand = unknown> = Required<DepartmentRecord> & BaseSystemFields<Texpand>
export type DetailResponse<Texpand = unknown> = Required<DetailRecord> & BaseSystemFields<Texpand>
export type DetailInfoResponse<Texpand = unknown> = Required<DetailInfoRecord> & BaseSystemFields<Texpand>
export type IssueResponse<Texpand = unknown> = Required<IssueRecord> & BaseSystemFields<Texpand>
export type ProjectResponse<Texpand = unknown> = Required<ProjectRecord> & BaseSystemFields<Texpand>
export type RequestResponse<Texpand = unknown> = Required<RequestRecord> & BaseSystemFields<Texpand>
export type RequestDetailResponse<Texpand = unknown> = Required<RequestDetailRecord> & BaseSystemFields<Texpand>
export type RequestDetailSupplierResponse<Texpand = unknown> = Required<RequestDetailSupplierRecord> & BaseSystemFields<Texpand>
export type SupplierResponse<Texpand = unknown> = Required<SupplierRecord> & BaseSystemFields<Texpand>
export type UserResponse<Texpand = unknown> = Required<UserRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	contract: ContractRecord
	customer: CustomerRecord
	department: DepartmentRecord
	detail: DetailRecord
	detailInfo: DetailInfoRecord
	issue: IssueRecord
	project: ProjectRecord
	request: RequestRecord
	requestDetail: RequestDetailRecord
	requestDetailSupplier: RequestDetailSupplierRecord
	supplier: SupplierRecord
	user: UserRecord
}

export type CollectionResponses = {
	contract: ContractResponse
	customer: CustomerResponse
	department: DepartmentResponse
	detail: DetailResponse
	detailInfo: DetailInfoResponse
	issue: IssueResponse
	project: ProjectResponse
	request: RequestResponse
	requestDetail: RequestDetailResponse
	requestDetailSupplier: RequestDetailSupplierResponse
	supplier: SupplierResponse
	user: UserResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'contract'): RecordService<ContractResponse>
	collection(idOrName: 'customer'): RecordService<CustomerResponse>
	collection(idOrName: 'department'): RecordService<DepartmentResponse>
	collection(idOrName: 'detail'): RecordService<DetailResponse>
	collection(idOrName: 'detailInfo'): RecordService<DetailInfoResponse>
	collection(idOrName: 'issue'): RecordService<IssueResponse>
	collection(idOrName: 'project'): RecordService<ProjectResponse>
	collection(idOrName: 'request'): RecordService<RequestResponse>
	collection(idOrName: 'requestDetail'): RecordService<RequestDetailResponse>
	collection(idOrName: 'requestDetailSupplier'): RecordService<RequestDetailSupplierResponse>
	collection(idOrName: 'supplier'): RecordService<SupplierResponse>
	collection(idOrName: 'user'): RecordService<UserResponse>
}
