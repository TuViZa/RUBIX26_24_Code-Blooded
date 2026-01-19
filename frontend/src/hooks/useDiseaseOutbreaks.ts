import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export type DiseaseOutbreak = {
  disease: string
  area: string
  severity: string
  total_cases: number
  reports: number
  latest_detection: string
  first_detection: string
  calculated_severity: string
  trend: string
}

export function useDiseaseOutbreaks() {
  const [outbreaks, setOutbreaks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('disease_outbreak_summary')
      .select('*')

    if (error) {
      console.error('Error fetching disease outbreaks:', error)
    } else {
      setOutbreaks(Array.isArray(data) ? data : [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()

    // Realtime disabled for stability
    // const channel = supabase
    //   .channel('realtime-disease-cases')
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'public', table: 'disease_cases' },
    //     () => {
    //       console.log('Realtime disease case → refreshing outbreaks')
    //       fetchData()
    //     }
    //   )
    //   .subscribe()

    // return () => {
    //   supabase.removeChannel(channel)
    // }
  }, [fetchData])

  return {
    outbreaks: Array.isArray(outbreaks) ? outbreaks : [],
    loading,
    error: null,
  }
}
