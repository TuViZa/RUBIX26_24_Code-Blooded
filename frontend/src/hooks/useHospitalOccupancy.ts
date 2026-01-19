import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export type HospitalOccupancy = {
  id: string
  name: string
  lat: number
  lng: number
  total_beds: number
  occupied_beds: number
  occupancy_ratio: number
}

export function useHospitalOccupancy() {
  const [data, setData] = useState<HospitalOccupancy[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('hospital_occupancy_view')
      .select('*')

    if (error) {
      console.error('Error fetching occupancy:', error)
    } else {
      setData(data ?? [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('realtime-bed-events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bed_events' },
        () => {
          console.log('Realtime bed event → refreshing occupancy')
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  return { data, loading, refresh: fetchData }
}
