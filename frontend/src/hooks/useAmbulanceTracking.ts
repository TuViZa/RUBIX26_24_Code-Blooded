import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useAmbulanceTracking() {
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("ambulance_events")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ambulance events:', error);
      } else {
        setAmbulances(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Unexpected error fetching ambulance events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  return {
    ambulances: Array.isArray(ambulances) ? ambulances : [],
    loading,
  };
}
