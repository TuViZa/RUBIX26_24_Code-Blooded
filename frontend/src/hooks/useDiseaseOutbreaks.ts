import { useEffect, useState, useCallback } from 'react'
<<<<<<< Updated upstream
import { supabase } from '@/lib/supabaseClient'
=======
import { supabaseServices } from '@/lib/supabase-services'
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
    const { data, error } = await supabase
      .from('disease_outbreak_summary')
      .select('*')

    if (error) {
      console.error('Error fetching disease outbreaks:', error)
    } else {
      setOutbreaks(Array.isArray(data) ? data : [])
=======
    try {
      // Get disease outbreaks from Supabase
      const data = await supabaseServices.disease.getOutbreaks()
      setOutbreaks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching disease outbreaks:', error)
      setOutbreaks([])
>>>>>>> Stashed changes
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()

<<<<<<< Updated upstream
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
=======
    // Listen for real-time updates from Supabase
    const unsubscribe = supabaseServices.disease.listenToOutbreaks((data) => {
      setOutbreaks(Array.isArray(data) ? data : [])
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
>>>>>>> Stashed changes
  }, [fetchData])

  return {
    outbreaks: Array.isArray(outbreaks) ? outbreaks : [],
    loading,
    error: null,
  }
}
