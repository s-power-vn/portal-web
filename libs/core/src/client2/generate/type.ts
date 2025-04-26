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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          approvers: Json | null
          assigned: string | null
          assignees: Json | null
          code: string | null
          created: string | null
          created_by: string | null
          deadline_status: string | null
          end_date: string | null
          id: string
          is_deleted: boolean | null
          last_assignees: Json | null
          object_id: string | null
          organization_id: string | null
          process_status: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          title: string
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          approvers?: Json | null
          assigned?: string | null
          assignees?: Json | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          deadline_status?: string | null
          end_date?: string | null
          id?: string
          is_deleted?: boolean | null
          last_assignees?: Json | null
          object_id?: string | null
          organization_id?: string | null
          process_status?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          approvers?: Json | null
          assigned?: string | null
          assignees?: Json | null
          code?: string | null
          created?: string | null
          created_by?: string | null
          deadline_status?: string | null
          end_date?: string | null
          id?: string
          is_deleted?: boolean | null
          last_assignees?: Json | null
          object_id?: string | null
          organization_id?: string | null
          process_status?: string | null
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      issues_comments: {
        Row: {
          content: string
          created: string | null
          created_by: string | null
          id: string
          issue_id: string
          organization_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          content: string
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_comments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_comments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      issues_files: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          issue_id: string
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
          issue_id: string
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
          issue_id?: string
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
            foreignKeyName: "issues_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_files_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_files_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_files_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      md_con_details: {
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
            foreignKeyName: "md_con_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "md_con_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      md_con_details_imports: {
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
            foreignKeyName: "md_con_details_imports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_imports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_imports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_imports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_imports_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_details_imports_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      md_con_prices: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          issue_id: string
          organization_id: string | null
          project_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id: string
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "md_con_prices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      md_con_prices_details: {
        Row: {
          created: string | null
          created_by: string | null
          estimate_amount: number | null
          estimate_price: number | null
          id: string
          index: string | null
          level: string | null
          md_con_price_id: string
          organization_id: string | null
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
          md_con_price_id: string
          organization_id?: string | null
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
          md_con_price_id?: string
          organization_id?: string | null
          prices?: Json | null
          title?: string
          unit?: string | null
          updated?: string | null
          updated_by?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "md_con_prices_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_details_md_con_price_id_fkey"
            columns: ["md_con_price_id"]
            isOneToOne: false
            referencedRelation: "md_con_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_prices_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      md_con_requests: {
        Row: {
          created: string | null
          created_by: string | null
          id: string
          issue_id: string
          organization_id: string | null
          project_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id: string
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          id?: string
          issue_id?: string
          organization_id?: string | null
          project_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "md_con_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      md_con_requests_details: {
        Row: {
          created: string | null
          created_by: string | null
          delivery_date: string | null
          id: string
          index: string | null
          level: string | null
          md_con_detail_id: string | null
          md_con_request_id: string
          note: string | null
          organization_id: string | null
          parent_id: string | null
          request_volume: number | null
          title: string | null
          unit: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          delivery_date?: string | null
          id?: string
          index?: string | null
          level?: string | null
          md_con_detail_id?: string | null
          md_con_request_id: string
          note?: string | null
          organization_id?: string | null
          parent_id?: string | null
          request_volume?: number | null
          title?: string | null
          unit?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          delivery_date?: string | null
          id?: string
          index?: string | null
          level?: string | null
          md_con_detail_id?: string | null
          md_con_request_id?: string
          note?: string | null
          organization_id?: string | null
          parent_id?: string | null
          request_volume?: number | null
          title?: string | null
          unit?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "md_con_requests_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_details_md_con_detail_id_fkey"
            columns: ["md_con_detail_id"]
            isOneToOne: false
            referencedRelation: "md_con_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_details_md_con_request_id_fkey"
            columns: ["md_con_request_id"]
            isOneToOne: false
            referencedRelation: "md_con_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_details_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "md_con_requests_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_con_requests_details_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_channels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_channels_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_chats_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_messages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_teams_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_teams_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "msg_teams_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_object_type_id_fkey"
            columns: ["object_type_id"]
            isOneToOne: false
            referencedRelation: "objects_types"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      objects_types: {
        Row: {
          color: string | null
          created: string | null
          description: string | null
          display: string | null
          icon: string | null
          id: string
          name: string
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
          updated?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          settings: Json | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          created?: string | null
          created_by?: string | null
          description?: string | null
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
      organizations_members: {
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
            foreignKeyName: "fk_organizations_members_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_members_user_id_fkey"
            columns: ["user_id"]
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_object_type_id_fkey"
            columns: ["object_type_id"]
            isOneToOne: false
            referencedRelation: "objects_types"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          attributes: Json | null
          created: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated: string | null
          updated_by: string | null
        }
        Insert: {
          attributes?: Json | null
          created?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
        }
        Update: {
          attributes?: Json | null
          created?: string | null
          created_by?: string | null
          description?: string | null
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_migrations: {
        Row: {
          dirty: boolean
          version: number
        }
        Insert: {
          dirty: boolean
          version: number
        }
        Update: {
          dirty?: boolean
          version?: number
        }
        Relationships: []
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          code: string
          created: string | null
          created_by: string | null
          id: string
          organization_id: string | null
          updated: string | null
          updated_by: string | null
          url: string
        }
        Insert: {
          code: string
          created?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
          url: string
        }
        Update: {
          code?: string
          created?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string | null
          updated?: string | null
          updated_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
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
      employees: {
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
            foreignKeyName: "fk_organizations_members_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "organizations_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      issues_info: {
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
          {
            foreignKeyName: "organizations_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "msg_unread"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organizations_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
    }
    Functions: {
      armor: {
        Args: { "": string }
        Returns: string
      }
      check_user_organization_access: {
        Args: { org_id: string; user_id: string }
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
      current_organization_member_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_project_id: {
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

