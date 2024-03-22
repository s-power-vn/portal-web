/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Customers = "customers",
	Departments = "departments",
	Users = "users",
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

export type CustomersRecord = {
	address?: string
	code?: string
	email?: string
	name: string
	note?: string
	phone?: string
}

export type DepartmentsRecord = {
	code?: string
	description?: string
	name: string
}

export type UsersRecord = {
	avatar?: string
	department: RecordIdString
	name: string
}

// Response types include system fields and match responses from the PocketBase API
export type CustomersResponse<Texpand = unknown> = Required<CustomersRecord> & BaseSystemFields<Texpand>
export type DepartmentsResponse<Texpand = unknown> = Required<DepartmentsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	customers: CustomersRecord
	departments: DepartmentsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	customers: CustomersResponse
	departments: DepartmentsResponse
	users: UsersResponse
}
