// Hand-written to mirror supabase-schema.sql. Kept in the shape the Supabase
// CLI emits (`supabase gen types typescript`) so it can be swapped for a
// generated file later. Update this when the schema changes.

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
      profiles: {
        Row: {
          id: string
          display_name: string
          preferred_translation: string
          notes_public_default: boolean
          theme_track_label: string | null
          is_admin: boolean
          created_at: string | null
        }
        Insert: {
          id: string
          display_name?: string
          preferred_translation?: string
          notes_public_default?: boolean
          theme_track_label?: string | null
          is_admin?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          display_name?: string
          preferred_translation?: string
          notes_public_default?: boolean
          theme_track_label?: string | null
          is_admin?: boolean
          created_at?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          user_id: string
          passage_ref: string
          track_id: string
          content: string
          is_public: boolean
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          passage_ref: string
          track_id: string
          content?: string
          is_public?: boolean
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          passage_ref?: string
          track_id?: string
          content?: string
          is_public?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'notes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      comments: {
        Row: {
          id: string
          user_id: string
          passage_ref: string
          track_id: string
          content: string
          parent_id: string | null
          parent_type: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          passage_ref: string
          track_id: string
          content: string
          parent_id?: string | null
          parent_type?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          passage_ref?: string
          track_id?: string
          content?: string
          parent_id?: string | null
          parent_type?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
        ]
      }
      passages: {
        Row: {
          id: string
          book_id: string
          chapter: number
          ref: string
          translation: string
          text: string
          fetched_at: string | null
        }
        Insert: {
          id?: string
          book_id: string
          chapter: number
          ref: string
          translation?: string
          text: string
          fetched_at?: string | null
        }
        Update: {
          id?: string
          book_id?: string
          chapter?: number
          ref?: string
          translation?: string
          text?: string
          fetched_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          note_id: string
          reporter_id: string | null
          reason: string
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          note_id: string
          reporter_id?: string | null
          reason?: string
          status?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          note_id?: string
          reporter_id?: string | null
          reason?: string
          status?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'reports_note_id_fkey'
            columns: ['note_id']
            isOneToOne: false
            referencedRelation: 'notes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reports_reporter_id_fkey'
            columns: ['reporter_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          comment_id: string
          passage_ref: string
          read: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          comment_id: string
          passage_ref: string
          read?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          comment_id?: string
          passage_ref?: string
          read?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notifications_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
        ]
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          passage_ref: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          passage_ref: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          passage_ref?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'bookmarks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'comment_likes_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comment_likes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      rate_limits: {
        Row: {
          id: string
          count: number
          window_start: string
        }
        Insert: {
          id: string
          count?: number
          window_start?: string
        }
        Update: {
          id?: string
          count?: number
          window_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      top_passages: {
        Args: { p_limit: number }
        Returns: {
          passage_ref: string
          notes: number
          lines: number
        }[]
      }
      get_my_profile: {
        Args: Record<string, never>
        Returns: {
          display_name: string
          preferred_translation: string
          notes_public_default: boolean
          theme_track_label: string | null
          is_admin: boolean
        }[]
      }
      reply_like_counts: {
        Args: { reply_ids: string[] }
        Returns: {
          comment_id: string
          likes: number
        }[]
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
