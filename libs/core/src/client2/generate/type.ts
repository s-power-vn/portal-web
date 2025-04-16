export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created: string | null
          created_by: string | null
          id: string
          issue_id: string | null
          organization_id: string | null
          status: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          content: string
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          organization_id?: string | null
          status?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          organization_id?: string | null
          status?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          count: number | null
          created: string | null
          created_by: string | null
          id: string
          note: string | null
          organization_id: string | null
          request_id: string | null
          supplier_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          count?: number | null
          created?: string | null
          created_by?: string | null
          id?: string
          note?: string | null
          organization_id?: string | null
          request_id?: string | null
          supplier_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          count?: number | null
          created?: string | null
          created_by?: string | null
          id?: string
          note?: string | null
          organization_id?: string | null
          request_id?: string | null
          supplier_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "contracts_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          code: string | null
          created: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          note: string | null
          organization_id: string | null
          phone: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          roles: Json | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          roles?: Json | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          roles?: Json | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "departments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "departments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "departments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "departments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      detail_imports: {
        Row: {
          created: string | null
          created_by: string | null
          error: string | null
          file: string
          id: string
          organization_id: string | null
          percent: number | null
          project_id: string | null
          status: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          error?: string | null
          file: string
          id?: string
          organization_id?: string | null
          percent?: number | null
          project_id?: string | null
          status?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          error?: string | null
          file?: string
          id?: string
          organization_id?: string | null
          percent?: number | null
          project_id?: string | null
          status?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detail_imports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "detail_imports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "detail_imports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detail_imports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detail_imports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detail_imports_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "detail_imports_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "detail_imports_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      details: {
        Row: {
          created: string | null
          created_by: string | null
          extend: Json | null
          id: string
          level: string | null
          note: string | null
          organization_id: string | null
          parent_id: string | null
          project_id: string | null
          title: string
          unit: string | null
          unit_price: number | null
          updated: string | null
          updated_by: string | null
          volume: number | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          extend?: Json | null
          id?: string
          level?: string | null
          note?: string | null
          organization_id?: string | null
          parent_id?: string | null
          project_id?: string | null
          title: string
          unit?: string | null
          unit_price?: number | null
          updated?: string | null
          updated_by?: string | null
          volume?: number | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          extend?: Json | null
          id?: string
          level?: string | null
          note?: string | null
          organization_id?: string | null
          parent_id?: string | null
          project_id?: string | null
          title?: string
          unit?: string | null
          unit_price?: number | null
          updated?: string | null
          updated_by?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "details_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_files: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          issue_id: string | null
          name: string
          organization_id: string | null
          size: number | null
          type: string | null
          updated: string | null
          updated_by: string | null
          url: string
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          name: string
          organization_id?: string | null
          size?: number | null
          type?: string | null
          updated?: string | null
          updated_by?: string | null
          url: string
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          name?: string
          organization_id?: string | null
          size?: number | null
          type?: string | null
          updated?: string | null
          updated_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issue_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issue_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_files_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "issue_files_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_files_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "issue_files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_files_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issue_files_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issue_files_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          approver: Json | null
          assigned: string | null
          assignees: Json | null
          code: string | null
          created: string | null
          created_by: string | null
          deadline_status: string | null
          deleted: boolean | null
          end_date: string | null
          id: string
          last_assignee: Json | null
          object_id: string | null
          organization_id: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          title: string
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          approver?: Json | null
          assigned?: string | null
          assignees?: Json | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          deadline_status?: string | null
          deleted?: boolean | null
          end_date?: string | null
          id?: string
          last_assignee?: Json | null
          object_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          approver?: Json | null
          assigned?: string | null
          assignees?: Json | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          deadline_status?: string | null
          deleted?: boolean | null
          end_date?: string | null
          id?: string
          last_assignee?: Json | null
          object_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issues_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issues_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          code: string | null
          created: string | null
          created_by: string | null
          id: string
          name: string
          note: string | null
          organization_id: string | null
          unit: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created?: string | null
          created_by?: string | null
          id?: string
          name: string
          note?: string | null
          organization_id?: string | null
          unit?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created?: string | null
          created_by?: string | null
          id?: string
          name?: string
          note?: string | null
          organization_id?: string | null
          unit?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "materials_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "materials_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_channels: {
        Row: {
          created: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          team_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          team_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          team_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_channels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_channels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_channels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_channels_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "msg_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_channels_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_channels_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_channels_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_chats: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          organization_id: string | null
          participants: Json | null
          type: string
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          participants?: Json | null
          type: string
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          participants?: Json | null
          type?: string
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_chats_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_chats_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_chats_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_chats_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_messages: {
        Row: {
          chat_id: string | null
          content: string
          created: string | null
          created_by: string | null
          id: string
          organization_id: string | null
          reply_to_id: string | null
          sender_id: string | null
          type: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          type?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          type?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "msg_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "msg_messages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "msg_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_reactions: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          message_id: string | null
          organization_id: string | null
          reaction: string
          updated: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          message_id?: string | null
          organization_id?: string | null
          reaction: string
          updated?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          message_id?: string | null
          organization_id?: string | null
          reaction?: string
          updated?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_reactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "msg_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_settings: {
        Row: {
          chat_id: string | null
          created: string | null
          created_by: string | null
          id: string
          last_read: string | null
          organization_id: string | null
          updated: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          created?: string | null
          created_by?: string | null
          id?: string
          last_read?: string | null
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          created?: string | null
          created_by?: string | null
          id?: string
          last_read?: string | null
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_settings_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "msg_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "msg_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_teams: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          members: Json | null
          name: string
          organization_id: string | null
          owner: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          members?: Json | null
          name: string
          organization_id?: string | null
          owner?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          members?: Json | null
          name?: string
          organization_id?: string | null
          owner?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_teams_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_teams_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_teams_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_teams_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_teams_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_teams_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      object_types: {
        Row: {
          color: string | null
          created: string | null
          created_by: string | null
          description: string | null
          display: string | null
          icon: string | null
          id: string
          name: string
          organization_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          color?: string | null
          created?: string | null
          created_by?: string | null
          description?: string | null
          display?: string | null
          icon?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          color?: string | null
          created?: string | null
          created_by?: string | null
          description?: string | null
          display?: string | null
          icon?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "object_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "object_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "object_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "object_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "object_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "object_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "object_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      objects: {
        Row: {
          active: boolean | null
          created: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          object_type_id: string | null
          organization_id: string | null
          process_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          active?: boolean | null
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          object_type_id?: string | null
          organization_id?: string | null
          process_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          active?: boolean | null
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          object_type_id?: string | null
          organization_id?: string | null
          process_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "objects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "objects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_object_type_id_fkey"
            columns: ["object_type_id"]
            isOneToOne: false
            referencedRelation: "object_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "objects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "objects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created: string | null
          created_by: string | null
          department_id: string | null
          department_role: string | null
          department_title: string | null
          id: string
          name: string | null
          organization_id: string | null
          role: string
          updated: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          department_id?: string | null
          department_role?: string | null
          department_title?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          role: string
          updated?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          department_id?: string | null
          department_role?: string | null
          department_title?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          role?: string
          updated?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          name: string
          settings: Json | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_details: {
        Row: {
          created: string | null
          created_by: string | null
          estimate_amount: number | null
          estimate_price: number | null
          id: string
          index: string | null
          level: string | null
          organization_id: string | null
          price_id: string | null
          prices: Json | null
          title: string
          unit: string | null
          updated: string | null
          updated_by: string | null
          volume: number | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          estimate_amount?: number | null
          estimate_price?: number | null
          id?: string
          index?: string | null
          level?: string | null
          organization_id?: string | null
          price_id?: string | null
          prices?: Json | null
          title: string
          unit?: string | null
          updated?: string | null
          updated_by?: string | null
          volume?: number | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          estimate_amount?: number | null
          estimate_price?: number | null
          id?: string
          index?: string | null
          level?: string | null
          organization_id?: string | null
          price_id?: string | null
          prices?: Json | null
          title?: string
          unit?: string | null
          updated?: string | null
          updated_by?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "price_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "price_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_details_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "price_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "price_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          issue_id: string | null
          organization_id: string | null
          project_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "prices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "prices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "prices_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "prices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "prices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "prices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          created: string | null
          created_by: string | null
          description: string | null
          finish_node: string | null
          id: string
          name: string
          object_type_id: string | null
          organization_id: string | null
          process: Json | null
          start_node: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          finish_node?: string | null
          id?: string
          name: string
          object_type_id?: string | null
          organization_id?: string | null
          process?: Json | null
          start_node?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          finish_node?: string | null
          id?: string
          name?: string
          object_type_id?: string | null
          organization_id?: string | null
          process?: Json | null
          start_node?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "processes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "processes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_object_type_id_fkey"
            columns: ["object_type_id"]
            isOneToOne: false
            referencedRelation: "object_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "processes_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "processes_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          bidding: string | null
          created: string | null
          created_by: string | null
          customer_id: string | null
          id: string
          name: string
          organization_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          bidding?: string | null
          created?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          bidding?: string | null
          created?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      request_details: {
        Row: {
          created: string | null
          created_by: string | null
          custom_level: string | null
          custom_title: string | null
          custom_unit: string | null
          delivery_date: string | null
          detail_id: string | null
          id: string
          index: string | null
          note: string | null
          organization_id: string | null
          request_id: string | null
          request_volume: number | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          custom_level?: string | null
          custom_title?: string | null
          custom_unit?: string | null
          delivery_date?: string | null
          detail_id?: string | null
          id?: string
          index?: string | null
          note?: string | null
          organization_id?: string | null
          request_id?: string | null
          request_volume?: number | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          custom_level?: string | null
          custom_title?: string | null
          custom_unit?: string | null
          delivery_date?: string | null
          detail_id?: string | null
          id?: string
          index?: string | null
          note?: string | null
          organization_id?: string | null
          request_id?: string | null
          request_volume?: number | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "request_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "request_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_detail_id_fkey"
            columns: ["detail_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "request_details_detail_id_fkey"
            columns: ["detail_id"]
            isOneToOne: false
            referencedRelation: "details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "request_details_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "request_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "request_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          issue_id: string | null
          organization_id: string | null
          project_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string | null
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "requests_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["issue_id"]
          },
          {
            foreignKeyName: "requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          code: string | null
          created: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          note: string | null
          organization_id: string | null
          phone: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suppliers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suppliers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suppliers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suppliers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created: string | null
          created_by: string | null
          detail_id: string | null
          id: string
          organization_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          detail_id?: string | null
          id?: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          detail_id?: string | null
          id?: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_detail_id_fkey"
            columns: ["detail_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "templates_detail_id_fkey"
            columns: ["detail_id"]
            isOneToOne: false
            referencedRelation: "details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar: string | null
          created: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          created?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          updated?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          created?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      detail_info: {
        Row: {
          created: string | null
          extend: Json | null
          group_id: string | null
          issue_code: string | null
          issue_id: string | null
          issue_title: string | null
          level: string | null
          note: string | null
          organization_id: string | null
          parent_id: string | null
          project_id: string | null
          request_id: string | null
          request_volume: number | null
          title: string | null
          unit: string | null
          unit_price: number | null
          updated: string | null
          volume: number | null
        }
        Relationships: [
          {
            foreignKeyName: "details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "details_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "request_details_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_user_info: {
        Row: {
          count: number | null
          organization_id: string | null
          project_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_unread: {
        Row: {
          chat_id: string | null
          chat_type: string | null
          organization_id: string | null
          unread_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_chats_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members_with_users: {
        Row: {
          created: string | null
          created_by: string | null
          department_id: string | null
          department_name: string | null
          department_role: string | null
          department_title: string | null
          id: string | null
          name: string | null
          organization_id: string | null
          role: string | null
          updated: string | null
          updated_by: string | null
          user_address: string | null
          user_avatar: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_phone: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      request_detail_info: {
        Row: {
          deleted: boolean | null
          detail_id: string | null
          id: string | null
          organization_id: string | null
          request_id: string | null
          request_volume: number | null
        }
        Relationships: [
          {
            foreignKeyName: "request_details_detail_id_fkey"
            columns: ["detail_id"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "request_details_detail_id_fkey"
            columns: ["detail_id"]
            isOneToOne: false
            referencedRelation: "details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "request_details_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_finished: {
        Row: {
          issue_id: string | null
          organization_id: string | null
          project_id: string | null
          request_id: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      armor: {
        Args: { "": string }
        Returns: string
      }
      check_user_organization_access: {
        Args: { p_organization_id: string; p_user_id: string }
        Returns: boolean
      }
      current_jwt_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      gen_random_bytes: {
        Args: { "": number }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: { "": string }
        Returns: string
      }
      generate_nanoid: {
        Args: { size?: number }
        Returns: string
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: { "": string }
        Returns: string
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: { namespace: string; name: string }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: { namespace: string; name: string }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

