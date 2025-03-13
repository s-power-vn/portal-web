/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
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
	MsgChannel = "msgChannel",
	MsgChat = "msgChat",
	MsgMessage = "msgMessage",
	MsgReaction = "msgReaction",
	MsgSetting = "msgSetting",
	MsgTeam = "msgTeam",
	MsgUnread = "msgUnread",
	Object = "object",
	ObjectType = "objectType",
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

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export enum ColumnTypeOptions {
	"Numeric" = "Numeric",
	"Text" = "Text",
}
export type ColumnRecord = {
	created?: IsoDateString
	id: string
	project: RecordIdString
	title: string
	type: ColumnTypeOptions
	updated?: IsoDateString
}

export type CommentRecord = {
	content?: string
	created?: IsoDateString
	createdBy: RecordIdString
	id: string
	issue: RecordIdString
	status?: string
	updated?: IsoDateString
}

export type ContractRecord = {
	count?: number
	created?: IsoDateString
	id: string
	note?: string
	request: RecordIdString
	supplier: RecordIdString
	updated?: IsoDateString
}

export type CustomerRecord = {
	address?: string
	code?: string
	created?: IsoDateString
	email?: string
	id: string
	name: string
	note?: string
	phone?: string
	updated?: IsoDateString
}

export type DepartmentRecord<Troles = unknown> = {
	created?: IsoDateString
	description?: string
	id: string
	name: string
	roles?: null | Troles
	updated?: IsoDateString
}

export type DetailRecord<Textend = unknown> = {
	created?: IsoDateString
	extend?: null | Textend
	id: string
	level: string
	note?: string
	parent?: string
	project: RecordIdString
	title: string
	unit?: string
	unitPrice?: number
	updated?: IsoDateString
	volume?: number
}

export enum DetailImportStatusOptions {
	"Working" = "Working",
	"Done" = "Done",
	"Error" = "Error",
}
export type DetailImportRecord = {
	created?: IsoDateString
	error?: string
	file?: string
	id: string
	percent?: number
	project?: RecordIdString
	status?: DetailImportStatusOptions
	updated?: IsoDateString
}

export type DetailInfoRecord<Textend = unknown> = {
	created?: IsoDateString
	extend?: null | Textend
	group?: RecordIdString
	id: string
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
	updated?: IsoDateString
	volume?: number
}

export enum IssueDeadlineStatusOptions {
	"Normal" = "Normal",
	"Warning" = "Warning",
	"Danger" = "Danger",
}
export type IssueRecord<Tapprover = unknown, TlastAssignee = unknown> = {
	approver?: null | Tapprover
	assignedDate?: IsoDateString
	assignees?: RecordIdString[]
	changed?: IsoDateString
	code?: string
	created?: IsoDateString
	createdBy?: RecordIdString
	deadlineStatus?: IssueDeadlineStatusOptions
	deleted?: boolean
	endDate?: IsoDateString
	id: string
	lastAssignee?: null | TlastAssignee
	object: RecordIdString
	project: RecordIdString
	startDate?: IsoDateString
	status?: string
	title: string
	updated?: IsoDateString
}

export type IssueFileRecord = {
	created?: IsoDateString
	id: string
	issue?: RecordIdString
	name?: string
	size?: number
	type?: string
	updated?: IsoDateString
	upload?: string
}

export type IssueUserInfoRecord<Tuser = unknown> = {
	count?: number
	id: string
	project: RecordIdString
	user?: null | Tuser
}

export type MaterialRecord = {
	code?: string
	created?: IsoDateString
	id: string
	name?: string
	note?: string
	unit?: string
	updated?: IsoDateString
}

export enum MsgChannelTypeOptions {
	"Public" = "Public",
	"Private" = "Private",
}
export type MsgChannelRecord = {
	created?: IsoDateString
	description?: string
	id: string
	name?: string
	team: RecordIdString
	type?: MsgChannelTypeOptions
	updated?: IsoDateString
}

export enum MsgChatTypeOptions {
	"Private" = "Private",
	"Group" = "Group",
	"Channel" = "Channel",
}
export type MsgChatRecord<TpinnedMessages = unknown> = {
	channel?: RecordIdString
	created?: IsoDateString
	hash: string
	id: string
	lastMessage?: RecordIdString
	name?: string
	participants?: RecordIdString[]
	pinnedMessages?: null | TpinnedMessages
	team?: RecordIdString
	type?: MsgChatTypeOptions
	updated?: IsoDateString
}

export enum MsgMessageTypeOptions {
	"Text" = "Text",
	"File" = "File",
	"Sticker" = "Sticker",
}
export type MsgMessageRecord<Tmetadata = unknown> = {
	chat: RecordIdString
	content?: string
	created?: IsoDateString
	file?: string
	id: string
	metadata?: null | Tmetadata
	replyTo?: RecordIdString
	sender: RecordIdString
	type?: MsgMessageTypeOptions
	updated?: IsoDateString
}

export type MsgReactionRecord = {
	created?: IsoDateString
	emojiCode?: string
	id: string
	message?: RecordIdString
	updated?: IsoDateString
	user?: RecordIdString
}

export type MsgSettingRecord = {
	chat: RecordIdString
	created?: IsoDateString
	id: string
	lastRead?: IsoDateString
	mute?: boolean
	updated?: IsoDateString
	user: RecordIdString
}

export type MsgTeamRecord = {
	created?: IsoDateString
	id: string
	logo?: string
	members?: RecordIdString[]
	name?: string
	owner?: RecordIdString
	updated?: IsoDateString
}

export enum MsgUnreadChatTypeOptions {
	"Private" = "Private",
	"Group" = "Group",
	"Channel" = "Channel",
}
export type MsgUnreadRecord<TunreadCount = unknown> = {
	chatId?: RecordIdString
	chatType?: MsgUnreadChatTypeOptions
	id: string
	unreadCount?: null | TunreadCount
	userId?: RecordIdString
}

export type ObjectRecord = {
	active?: boolean
	base?: boolean
	created?: IsoDateString
	description?: string
	id: string
	name: string
	process?: RecordIdString
	type: RecordIdString
	updated?: IsoDateString
}

export type ObjectTypeRecord = {
	color?: string
	created?: IsoDateString
	description?: string
	display?: string
	icon?: string
	id: string
	name: string
	updated?: IsoDateString
}

export type PriceRecord = {
	created?: IsoDateString
	id: string
	issue: RecordIdString
	project: RecordIdString
	updated?: IsoDateString
}

export type PriceDetailRecord<Tprices = unknown> = {
	created?: IsoDateString
	estimateAmount?: number
	estimatePrice?: number
	id: string
	index?: string
	level?: string
	price: RecordIdString
	prices?: null | Tprices
	title?: string
	unit?: string
	updated?: IsoDateString
	volume?: number
}

export type ProcessRecord<Tprocess = unknown> = {
	created?: IsoDateString
	createdBy: RecordIdString
	description?: string
	finishedNode?: string
	id: string
	name: string
	objectType: RecordIdString
	process?: null | Tprocess
	startNode?: string
	updated?: IsoDateString
}

export type ProjectRecord = {
	bidding?: string
	created?: IsoDateString
	createdBy?: RecordIdString
	customer?: RecordIdString
	id: string
	name?: string
	updated?: IsoDateString
}

export type RequestRecord = {
	created?: IsoDateString
	id: string
	issue: RecordIdString
	project: RecordIdString
	updated?: IsoDateString
}

export type RequestDetailRecord = {
	created?: IsoDateString
	customLevel?: string
	customTitle?: string
	customUnit?: string
	deliveryDate?: IsoDateString
	detail?: RecordIdString
	id: string
	index?: string
	note?: string
	request: RecordIdString
	requestVolume?: number
	updated?: IsoDateString
}

export type RequestDetailInfoRecord = {
	deleted?: boolean
	detail?: RecordIdString
	id: string
	request: RecordIdString
	requestVolume?: number
}

export type SupplierRecord = {
	address?: string
	code?: string
	created?: IsoDateString
	email?: string
	id: string
	name: string
	note?: string
	phone?: string
	updated?: IsoDateString
}

export type TemplateRecord = {
	created?: IsoDateString
	detail?: string
	id: string
	updated?: IsoDateString
}

export type UserRecord = {
	avatar?: string
	created?: IsoDateString
	department: RecordIdString
	displayEmail?: string
	email?: string
	emailVisibility?: boolean
	id: string
	name: string
	password: string
	phone?: string
	role?: string
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ColumnResponse<Texpand = unknown> = Required<ColumnRecord> & BaseSystemFields<Texpand>
export type CommentResponse<Texpand = unknown> = Required<CommentRecord> & BaseSystemFields<Texpand>
export type ContractResponse<Texpand = unknown> = Required<ContractRecord> & BaseSystemFields<Texpand>
export type CustomerResponse<Texpand = unknown> = Required<CustomerRecord> & BaseSystemFields<Texpand>
export type DepartmentResponse<Troles = unknown, Texpand = unknown> = Required<DepartmentRecord<Troles>> & BaseSystemFields<Texpand>
export type DetailResponse<Textend = unknown, Texpand = unknown> = Required<DetailRecord<Textend>> & BaseSystemFields<Texpand>
export type DetailImportResponse<Texpand = unknown> = Required<DetailImportRecord> & BaseSystemFields<Texpand>
export type DetailInfoResponse<Textend = unknown, Texpand = unknown> = Required<DetailInfoRecord<Textend>> & BaseSystemFields<Texpand>
export type IssueResponse<Tapprover = unknown, TlastAssignee = unknown, Texpand = unknown> = Required<IssueRecord<Tapprover, TlastAssignee>> & BaseSystemFields<Texpand>
export type IssueFileResponse<Texpand = unknown> = Required<IssueFileRecord> & BaseSystemFields<Texpand>
export type IssueUserInfoResponse<Tuser = unknown, Texpand = unknown> = Required<IssueUserInfoRecord<Tuser>> & BaseSystemFields<Texpand>
export type MaterialResponse<Texpand = unknown> = Required<MaterialRecord> & BaseSystemFields<Texpand>
export type MsgChannelResponse<Texpand = unknown> = Required<MsgChannelRecord> & BaseSystemFields<Texpand>
export type MsgChatResponse<TpinnedMessages = unknown, Texpand = unknown> = Required<MsgChatRecord<TpinnedMessages>> & BaseSystemFields<Texpand>
export type MsgMessageResponse<Tmetadata = unknown, Texpand = unknown> = Required<MsgMessageRecord<Tmetadata>> & BaseSystemFields<Texpand>
export type MsgReactionResponse<Texpand = unknown> = Required<MsgReactionRecord> & BaseSystemFields<Texpand>
export type MsgSettingResponse<Texpand = unknown> = Required<MsgSettingRecord> & BaseSystemFields<Texpand>
export type MsgTeamResponse<Texpand = unknown> = Required<MsgTeamRecord> & BaseSystemFields<Texpand>
export type MsgUnreadResponse<TunreadCount = unknown, Texpand = unknown> = Required<MsgUnreadRecord<TunreadCount>> & BaseSystemFields<Texpand>
export type ObjectResponse<Texpand = unknown> = Required<ObjectRecord> & BaseSystemFields<Texpand>
export type ObjectTypeResponse<Texpand = unknown> = Required<ObjectTypeRecord> & BaseSystemFields<Texpand>
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
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
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
	msgChannel: MsgChannelRecord
	msgChat: MsgChatRecord
	msgMessage: MsgMessageRecord
	msgReaction: MsgReactionRecord
	msgSetting: MsgSettingRecord
	msgTeam: MsgTeamRecord
	msgUnread: MsgUnreadRecord
	object: ObjectRecord
	objectType: ObjectTypeRecord
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
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
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
	msgChannel: MsgChannelResponse
	msgChat: MsgChatResponse
	msgMessage: MsgMessageResponse
	msgReaction: MsgReactionResponse
	msgSetting: MsgSettingResponse
	msgTeam: MsgTeamResponse
	msgUnread: MsgUnreadResponse
	object: ObjectResponse
	objectType: ObjectTypeResponse
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
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
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
	collection(idOrName: 'msgChannel'): RecordService<MsgChannelResponse>
	collection(idOrName: 'msgChat'): RecordService<MsgChatResponse>
	collection(idOrName: 'msgMessage'): RecordService<MsgMessageResponse>
	collection(idOrName: 'msgReaction'): RecordService<MsgReactionResponse>
	collection(idOrName: 'msgSetting'): RecordService<MsgSettingResponse>
	collection(idOrName: 'msgTeam'): RecordService<MsgTeamResponse>
	collection(idOrName: 'msgUnread'): RecordService<MsgUnreadResponse>
	collection(idOrName: 'object'): RecordService<ObjectResponse>
	collection(idOrName: 'objectType'): RecordService<ObjectTypeResponse>
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
