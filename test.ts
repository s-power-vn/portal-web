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
          issue: string | null
          organization_id: string | null
          status: string | null
          updated: string | null
        }
        Insert: {
          content: string
          created?: string | null
          created_by?: string | null
          id?: string
          issue?: string | null
          organization_id?: string | null
          status?: string | null
          updated?: string | null
        }
        Update: {
          content?: string
          created?: string | null
          created_by?: string | null
          id?: string
          issue?: string | null
          organization_id?: string | null
          status?: string | null
          updated?: string | null
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
            foreignKeyName: "comments_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue"]
          },
          {
            foreignKeyName: "comments_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_issue_fkey"
            columns: ["issue"]
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
        ]
      }
      contracts: {
        Row: {
          count: number | null
          created: string | null
          id: string
          note: string | null
          organization_id: string | null
          request: string | null
          supplier: string | null
          updated: string | null
        }
        Insert: {
          count?: number | null
          created?: string | null
          id?: string
          note?: string | null
          organization_id?: string | null
          request?: string | null
          supplier?: string | null
          updated?: string | null
        }
        Update: {
          count?: number | null
          created?: string | null
          id?: string
          note?: string | null
          organization_id?: string | null
          request?: string | null
          supplier?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_request_fkey"
            columns: ["request"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "contracts_request_fkey"
            columns: ["request"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_supplier_fkey"
            columns: ["supplier"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          code: string | null
          created: string | null
          email: string | null
          id: string
          name: string
          note: string | null
          organization_id: string | null
          phone: string | null
          updated: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          created?: string | null
          email?: string | null
          id?: string
          name: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          created?: string | null
          email?: string | null
          id?: string
          name?: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          roles: Json | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          roles?: Json | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          roles?: Json | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      detail_imports: {
        Row: {
          created: string | null
          error: string | null
          file: string
          id: string
          organization_id: string | null
          percent: number | null
          project: string | null
          status: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          error?: string | null
          file: string
          id?: string
          organization_id?: string | null
          percent?: number | null
          project?: string | null
          status?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          error?: string | null
          file?: string
          id?: string
          organization_id?: string | null
          percent?: number | null
          project?: string | null
          status?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detail_imports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detail_imports_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      details: {
        Row: {
          created: string | null
          extend: Json | null
          id: string
          level: string | null
          note: string | null
          organization_id: string | null
          parent: string | null
          project: string | null
          title: string
          unit: string | null
          unit_price: number | null
          updated: string | null
          volume: number | null
        }
        Insert: {
          created?: string | null
          extend?: Json | null
          id?: string
          level?: string | null
          note?: string | null
          organization_id?: string | null
          parent?: string | null
          project?: string | null
          title: string
          unit?: string | null
          unit_price?: number | null
          updated?: string | null
          volume?: number | null
        }
        Update: {
          created?: string | null
          extend?: Json | null
          id?: string
          level?: string | null
          note?: string | null
          organization_id?: string | null
          parent?: string | null
          project?: string | null
          title?: string
          unit?: string | null
          unit_price?: number | null
          updated?: string | null
          volume?: number | null
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
            foreignKeyName: "details_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "details_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_files: {
        Row: {
          created: string | null
          id: string
          issue: string | null
          name: string
          organization_id: string | null
          size: number | null
          type: string | null
          updated: string | null
          upload: string
        }
        Insert: {
          created?: string | null
          id?: string
          issue?: string | null
          name: string
          organization_id?: string | null
          size?: number | null
          type?: string | null
          updated?: string | null
          upload: string
        }
        Update: {
          created?: string | null
          id?: string
          issue?: string | null
          name?: string
          organization_id?: string | null
          size?: number | null
          type?: string | null
          updated?: string | null
          upload?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_files_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue"]
          },
          {
            foreignKeyName: "issue_files_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_files_issue_fkey"
            columns: ["issue"]
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
        ]
      }
      issues: {
        Row: {
          approver: Json | null
          assigned_date: string | null
          assignees: Json | null
          changed: string | null
          code: string | null
          created: string | null
          created_by: string | null
          deadline_status: string | null
          deleted: boolean | null
          end_date: string | null
          id: string
          last_assignee: Json | null
          object: string | null
          organization_id: string | null
          project: string | null
          start_date: string | null
          status: string | null
          title: string
          updated: string | null
        }
        Insert: {
          approver?: Json | null
          assigned_date?: string | null
          assignees?: Json | null
          changed?: string | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          deadline_status?: string | null
          deleted?: boolean | null
          end_date?: string | null
          id?: string
          last_assignee?: Json | null
          object?: string | null
          organization_id?: string | null
          project?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated?: string | null
        }
        Update: {
          approver?: Json | null
          assigned_date?: string | null
          assignees?: Json | null
          changed?: string | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          deadline_status?: string | null
          deleted?: boolean | null
          end_date?: string | null
          id?: string
          last_assignee?: Json | null
          object?: string | null
          organization_id?: string | null
          project?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated?: string | null
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
            foreignKeyName: "issues_object_fkey"
            columns: ["object"]
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
            foreignKeyName: "issues_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          code: string | null
          created: string | null
          id: string
          name: string
          note: string | null
          organization_id: string | null
          unit: string | null
          updated: string | null
        }
        Insert: {
          code?: string | null
          created?: string | null
          id?: string
          name: string
          note?: string | null
          organization_id?: string | null
          unit?: string | null
          updated?: string | null
        }
        Update: {
          code?: string | null
          created?: string | null
          id?: string
          name?: string
          note?: string | null
          organization_id?: string | null
          unit?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_channels: {
        Row: {
          created: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          team: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          team?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          team?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_channels_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "msg_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_chats: {
        Row: {
          created: string | null
          id: string
          organization_id: string | null
          participants: Json | null
          type: string
          updated: string | null
        }
        Insert: {
          created?: string | null
          id?: string
          organization_id?: string | null
          participants?: Json | null
          type: string
          updated?: string | null
        }
        Update: {
          created?: string | null
          id?: string
          organization_id?: string | null
          participants?: Json | null
          type?: string
          updated?: string | null
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
      msg_messages: {
        Row: {
          chat: string | null
          content: string
          created: string | null
          id: string
          organization_id: string | null
          reply_to: string | null
          sender: string | null
          type: string | null
          updated: string | null
        }
        Insert: {
          chat?: string | null
          content: string
          created?: string | null
          id?: string
          organization_id?: string | null
          reply_to?: string | null
          sender?: string | null
          type?: string | null
          updated?: string | null
        }
        Update: {
          chat?: string | null
          content?: string
          created?: string | null
          id?: string
          organization_id?: string | null
          reply_to?: string | null
          sender?: string | null
          type?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_messages_chat_fkey"
            columns: ["chat"]
            isOneToOne: false
            referencedRelation: "msg_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_chat_fkey"
            columns: ["chat"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "msg_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "msg_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_messages_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_reactions: {
        Row: {
          created: string | null
          id: string
          message: string | null
          organization_id: string | null
          reaction: string
          updated: string | null
          user: string | null
        }
        Insert: {
          created?: string | null
          id?: string
          message?: string | null
          organization_id?: string | null
          reaction: string
          updated?: string | null
          user?: string | null
        }
        Update: {
          created?: string | null
          id?: string
          message?: string | null
          organization_id?: string | null
          reaction?: string
          updated?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_reactions_message_fkey"
            columns: ["message"]
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
            foreignKeyName: "msg_reactions_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_reactions_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_settings: {
        Row: {
          chat: string | null
          created: string | null
          id: string
          last_read: string | null
          organization_id: string | null
          updated: string | null
          user: string | null
        }
        Insert: {
          chat?: string | null
          created?: string | null
          id?: string
          last_read?: string | null
          organization_id?: string | null
          updated?: string | null
          user?: string | null
        }
        Update: {
          chat?: string | null
          created?: string | null
          id?: string
          last_read?: string | null
          organization_id?: string | null
          updated?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msg_settings_chat_fkey"
            columns: ["chat"]
            isOneToOne: false
            referencedRelation: "msg_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_chat_fkey"
            columns: ["chat"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "msg_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "issue_user_info"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "msg_settings_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      msg_teams: {
        Row: {
          created: string | null
          id: string
          members: Json | null
          name: string
          organization_id: string | null
          owner: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          id?: string
          members?: Json | null
          name: string
          organization_id?: string | null
          owner?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          id?: string
          members?: Json | null
          name?: string
          organization_id?: string | null
          owner?: string | null
          updated?: string | null
        }
        Relationships: [
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
        ]
      }
      object_types: {
        Row: {
          color: string | null
          created: string | null
          description: string | null
          display: string | null
          icon: string | null
          id: string
          name: string
          organization_id: string | null
          updated: string | null
        }
        Insert: {
          color?: string | null
          created?: string | null
          description?: string | null
          display?: string | null
          icon?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated?: string | null
        }
        Update: {
          color?: string | null
          created?: string | null
          description?: string | null
          display?: string | null
          icon?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "object_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      objects: {
        Row: {
          created: string | null
          id: string
          name: string
          organization_id: string | null
          type: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          id?: string
          name: string
          organization_id?: string | null
          type?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          type?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "object_types"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created: string | null
          department: string | null
          id: string
          organization_id: string | null
          role: string
          updated: string | null
          user_id: string | null
        }
        Insert: {
          created?: string | null
          department?: string | null
          id?: string
          organization_id?: string | null
          role: string
          updated?: string | null
          user_id?: string | null
        }
        Update: {
          created?: string | null
          department?: string | null
          id?: string
          organization_id?: string | null
          role?: string
          updated?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_department_fkey"
            columns: ["department"]
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
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated?: string | null
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
        ]
      }
      price_details: {
        Row: {
          created: string | null
          estimate_amount: number | null
          estimate_price: number | null
          id: string
          index: string | null
          level: string | null
          organization_id: string | null
          price: string | null
          prices: Json | null
          title: string
          unit: string | null
          updated: string | null
          volume: number | null
        }
        Insert: {
          created?: string | null
          estimate_amount?: number | null
          estimate_price?: number | null
          id?: string
          index?: string | null
          level?: string | null
          organization_id?: string | null
          price?: string | null
          prices?: Json | null
          title: string
          unit?: string | null
          updated?: string | null
          volume?: number | null
        }
        Update: {
          created?: string | null
          estimate_amount?: number | null
          estimate_price?: number | null
          id?: string
          index?: string | null
          level?: string | null
          organization_id?: string | null
          price?: string | null
          prices?: Json | null
          title?: string
          unit?: string | null
          updated?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_details_price_fkey"
            columns: ["price"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          created: string | null
          id: string
          issue: string | null
          organization_id: string | null
          project: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          id?: string
          issue?: string | null
          organization_id?: string | null
          project?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          id?: string
          issue?: string | null
          organization_id?: string | null
          project?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue"]
          },
          {
            foreignKeyName: "prices_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_issue_fkey"
            columns: ["issue"]
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
            foreignKeyName: "prices_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
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
          object_type: string | null
          organization_id: string | null
          process: Json | null
          start_node: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          finish_node?: string | null
          id?: string
          name: string
          object_type?: string | null
          organization_id?: string | null
          process?: Json | null
          start_node?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          finish_node?: string | null
          id?: string
          name?: string
          object_type?: string | null
          organization_id?: string | null
          process?: Json | null
          start_node?: string | null
          updated?: string | null
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
            foreignKeyName: "processes_object_type_fkey"
            columns: ["object_type"]
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
        ]
      }
      projects: {
        Row: {
          bidding: string | null
          created: string | null
          created_by: string | null
          customer: string | null
          id: string
          name: string
          organization_id: string | null
          updated: string | null
        }
        Insert: {
          bidding?: string | null
          created?: string | null
          created_by?: string | null
          customer?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated?: string | null
        }
        Update: {
          bidding?: string | null
          created?: string | null
          created_by?: string | null
          customer?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated?: string | null
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
            foreignKeyName: "projects_customer_fkey"
            columns: ["customer"]
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
        ]
      }
      request_details: {
        Row: {
          created: string | null
          custom_level: string | null
          custom_title: string | null
          custom_unit: string | null
          delivery_date: string | null
          detail: string | null
          id: string
          index: string | null
          note: string | null
          organization_id: string | null
          request: string | null
          request_volume: number | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          custom_level?: string | null
          custom_title?: string | null
          custom_unit?: string | null
          delivery_date?: string | null
          detail?: string | null
          id?: string
          index?: string | null
          note?: string | null
          organization_id?: string | null
          request?: string | null
          request_volume?: number | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          custom_level?: string | null
          custom_title?: string | null
          custom_unit?: string | null
          delivery_date?: string | null
          detail?: string | null
          id?: string
          index?: string | null
          note?: string | null
          organization_id?: string | null
          request?: string | null
          request_volume?: number | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_details_detail_fkey"
            columns: ["detail"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "request_details_detail_fkey"
            columns: ["detail"]
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
            foreignKeyName: "request_details_request_fkey"
            columns: ["request"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "request_details_request_fkey"
            columns: ["request"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created: string | null
          id: string
          issue: string | null
          organization_id: string | null
          project: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          id?: string
          issue?: string | null
          organization_id?: string | null
          project?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          id?: string
          issue?: string | null
          organization_id?: string | null
          project?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["issue"]
          },
          {
            foreignKeyName: "requests_issue_fkey"
            columns: ["issue"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_issue_fkey"
            columns: ["issue"]
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
            foreignKeyName: "requests_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          code: string | null
          created: string | null
          email: string | null
          id: string
          name: string
          note: string | null
          organization_id: string | null
          phone: string | null
          updated: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          created?: string | null
          email?: string | null
          id?: string
          name: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          created?: string | null
          email?: string | null
          id?: string
          name?: string
          note?: string | null
          organization_id?: string | null
          phone?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created: string | null
          detail: string
          id: string
          organization_id: string | null
          updated: string | null
        }
        Insert: {
          created?: string | null
          detail: string
          id?: string
          organization_id?: string | null
          updated?: string | null
        }
        Update: {
          created?: string | null
          detail?: string
          id?: string
          organization_id?: string | null
          updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          issue: string | null
          issue_code: string | null
          issue_title: string | null
          level: string | null
          note: string | null
          organization_id: string | null
          parent: string | null
          project: string | null
          request: string | null
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
            foreignKeyName: "details_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "details_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "details_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_details_request_fkey"
            columns: ["request"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "request_details_request_fkey"
            columns: ["request"]
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
          project: string | null
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
            foreignKeyName: "issues_project_fkey"
            columns: ["project"]
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
      request_detail_info: {
        Row: {
          deleted: boolean | null
          detail: string | null
          id: string | null
          organization_id: string | null
          request: string | null
          request_volume: number | null
        }
        Relationships: [
          {
            foreignKeyName: "request_details_detail_fkey"
            columns: ["detail"]
            isOneToOne: false
            referencedRelation: "detail_info"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "request_details_detail_fkey"
            columns: ["detail"]
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
            foreignKeyName: "request_details_request_fkey"
            columns: ["request"]
            isOneToOne: false
            referencedRelation: "request_finished"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "request_details_request_fkey"
            columns: ["request"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_finished: {
        Row: {
          changed: string | null
          issue_id: string | null
          organization_id: string | null
          project: string | null
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
            foreignKeyName: "issues_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      armor: {
        Args: {
          "": string
        }
        Returns: string
      }
      create_delete_policy_for_admin: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      create_delete_policy_for_operator: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      create_insert_policy_for_member: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      create_insert_policy_for_operator: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      create_select_policy: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      create_update_policy_for_member: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      create_update_policy_for_operator: {
        Args: {
          table_name: string
        }
        Returns: undefined
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
        Args: {
          "": string
        }
        Returns: string
      }
      gen_random_bytes: {
        Args: {
          "": number
        }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: {
          "": string
        }
        Returns: string
      }
      pgp_armor_headers: {
        Args: {
          "": string
        }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: {
          "": string
        }
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
        Args: {
          namespace: string
          name: string
        }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: {
          namespace: string
          name: string
        }
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

