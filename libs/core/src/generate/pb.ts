/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Contract = "contract",
	ContractItem = "contractItem",
	ContractItemFile = "contractItemFile",
	Customer = "customer",
	Department = "department",
	Detail = "detail",
	DetailInfo = "detailInfo",
	DetailMax = "detailMax",
	Document = "document",
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

export enum ContractItemStatusOptions {
	"ToDo" = "ToDo",
	"Done" = "Done",
}
export type ContractItemRecord = {
	contract: RecordIdString
	index?: number
	status?: ContractItemStatusOptions
}

export type ContractItemFileRecord = {
	contractItem?: RecordIdString
	file?: string
	name?: string
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
	index?: number
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
	index?: number
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

export type DetailMaxRecord<TmaxIndex = unknown> = {
	maxIndex?: null | TmaxIndex
}

export enum DocumentStatusOptions {
	"ToDo" = "ToDo",
	"Done" = "Done",
}
export type DocumentRecord = {
	assignee?: RecordIdString
	bidding?: string
	createdBy?: RecordIdString
	customer?: RecordIdString
	name?: string
	status?: DocumentStatusOptions
}

export type RequestRecord = {
	createdBy?: RecordIdString
	document: RecordIdString
	name?: string
	status?: string
}

export type RequestDetailRecord = {
	detail: RecordIdString
	request: RecordIdString
	volume?: number
}

export enum RequestDetailSupplierStatusOptions {
	"ToDo" = "ToDo",
	"Done" = "Done",
}
export type RequestDetailSupplierRecord = {
	price?: number
	requestDetail?: RecordIdString
	status?: RequestDetailSupplierStatusOptions
	supplier?: RecordIdString
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
export type ContractItemResponse<Texpand = unknown> = Required<ContractItemRecord> & BaseSystemFields<Texpand>
export type ContractItemFileResponse<Texpand = unknown> = Required<ContractItemFileRecord> & BaseSystemFields<Texpand>
export type CustomerResponse<Texpand = unknown> = Required<CustomerRecord> & BaseSystemFields<Texpand>
export type DepartmentResponse<Texpand = unknown> = Required<DepartmentRecord> & BaseSystemFields<Texpand>
export type DetailResponse<Texpand = unknown> = Required<DetailRecord> & BaseSystemFields<Texpand>
export type DetailInfoResponse<Texpand = unknown> = Required<DetailInfoRecord> & BaseSystemFields<Texpand>
export type DetailMaxResponse<TmaxIndex = unknown, Texpand = unknown> = Required<DetailMaxRecord<TmaxIndex>> & BaseSystemFields<Texpand>
export type DocumentResponse<Texpand = unknown> = Required<DocumentRecord> & BaseSystemFields<Texpand>
export type RequestResponse<Texpand = unknown> = Required<RequestRecord> & BaseSystemFields<Texpand>
export type RequestDetailResponse<Texpand = unknown> = Required<RequestDetailRecord> & BaseSystemFields<Texpand>
export type RequestDetailSupplierResponse<Texpand = unknown> = Required<RequestDetailSupplierRecord> & BaseSystemFields<Texpand>
export type SupplierResponse<Texpand = unknown> = Required<SupplierRecord> & BaseSystemFields<Texpand>
export type UserResponse<Texpand = unknown> = Required<UserRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	contract: ContractRecord
	contractItem: ContractItemRecord
	contractItemFile: ContractItemFileRecord
	customer: CustomerRecord
	department: DepartmentRecord
	detail: DetailRecord
	detailInfo: DetailInfoRecord
	detailMax: DetailMaxRecord
	document: DocumentRecord
	request: RequestRecord
	requestDetail: RequestDetailRecord
	requestDetailSupplier: RequestDetailSupplierRecord
	supplier: SupplierRecord
	user: UserRecord
}

export type CollectionResponses = {
	contract: ContractResponse
	contractItem: ContractItemResponse
	contractItemFile: ContractItemFileResponse
	customer: CustomerResponse
	department: DepartmentResponse
	detail: DetailResponse
	detailInfo: DetailInfoResponse
	detailMax: DetailMaxResponse
	document: DocumentResponse
	request: RequestResponse
	requestDetail: RequestDetailResponse
	requestDetailSupplier: RequestDetailSupplierResponse
	supplier: SupplierResponse
	user: UserResponse
}
