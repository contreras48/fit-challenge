import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import type { Database } from '@/types/database.types'

export type LeaderboardItem = Database['public']['Views']['leaderboard_view']['Row']

export function useLeaderboard(challengeId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['leaderboard', challengeId],
    queryFn: async () => {
      let query = supabase
        .from('leaderboard_view')
        .select('*')
        .order('progress_percentage', { ascending: false })

      if (challengeId) {
        query = query.eq('challenge_id', challengeId)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data as LeaderboardItem[]
    },
  })
}