export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'participant'
export type GoalType = 'weight_loss' | 'weight_gain' | 'body_recomp'
export type ChallengeStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          role?: UserRole
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          start_date: string
          end_date: string
          status: ChallengeStatus
          is_public: boolean
          created_by: string
          created_at: string
        }
      }
      challenge_participants: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          goal_type: GoalType
          initial_weight: number
          target_weight: number
          joined_at: string
        }
      }
      check_ins: {
        Row: {
          id: string
          participant_id: string
          weight: number
          chest_cm: number | null
          waist_cm: number | null
          hip_cm: number | null
          notes: string | null
          check_in_date: string
          created_at: string
        }
      }
    }
    Views: {
      leaderboard_view: {
        Row: {
          participant_id: string
          challenge_id: string
          user_id: string
          full_name: string
          avatar_url: string | null
          goal_type: GoalType
          last_check_in: string | null
          progress_percentage: number
        }
      }
    }
  }
}