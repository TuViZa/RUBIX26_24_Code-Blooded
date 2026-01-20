import { useEffect, useState, useCallback } from 'react'
<<<<<<< Updated upstream
import { supabase } from '@/lib/supabaseClient'
=======
import { mediSyncServices } from '@/lib/firebase-services'
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
    const { data, error } = await supabase
      .from('hospital_occupancy_view')
      .select('*')

    if (error) {
      console.error('Error fetching occupancy:', error)
    } else {
      setData(data ?? [])
=======
    try {
      // Get hospital occupancy from Firebase
      const hospitals = await mediSyncServices.beds.getAll()
      const occupancyData = Object.entries(hospitals || {}).map(([id, hospital]: [string, any]) => ({
        id,
        name: hospital.name || `Hospital ${id}`,
        lat: hospital.lat || 0,
        lng: hospital.lng || 0,
        total_beds: hospital.totalBeds || 100,
        occupied_beds: hospital.occupiedBeds || 50,
        occupancy_ratio: hospital.occupancyRatio || 0.5
      }))
      setData(occupancyData)
    } catch (error) {
      console.error('Error fetching occupancy:', error)
      setData([])
>>>>>>> Stashed changes
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()

<<<<<<< Updated upstream
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
=======
    // Listen for real-time updates
    const unsubscribe = mediSyncServices.beds.listen((beds) => {
      const occupancyData = Object.entries(beds || {}).map(([id, hospital]: [string, any]) => ({
        id,
        name: hospital.name || `Hospital ${id}`,
        lat: hospital.lat || 0,
        lng: hospital.lng || 0,
        total_beds: hospital.totalBeds || 100,
        occupied_beds: hospital.occupiedBeds || 50,
        occupancy_ratio: hospital.occupancyRatio || 0.5
      }))
      setData(occupancyData)
    })

    return () => {
      if (unsubscribe) unsubscribe()
>>>>>>> Stashed changes
    }
  }, [fetchData])

  return { data, loading, refresh: fetchData }
}
