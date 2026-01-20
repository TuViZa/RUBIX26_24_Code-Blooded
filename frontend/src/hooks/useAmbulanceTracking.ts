import { useEffect, useState, useCallback } from 'react'
<<<<<<< Updated upstream
import { supabase } from '@/lib/supabaseClient'
=======
import { supabaseServices } from '@/lib/supabase-services'
>>>>>>> Stashed changes

export function useAmbulanceTracking() {
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
<<<<<<< Updated upstream
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
=======
      // Get ambulance events from Supabase
      const data = await supabaseServices.ambulance.getEvents()
      setAmbulances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching ambulance events:', error);
      setAmbulances([]);
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
<<<<<<< Updated upstream
=======
    
    // Listen for real-time updates from Supabase
    const unsubscribe = supabaseServices.ambulance.listenToEvents((data) => {
      setAmbulances(Array.isArray(data) ? data : []);
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
>>>>>>> Stashed changes
  }, [])

  return {
    ambulances: Array.isArray(ambulances) ? ambulances : [],
    loading,
  };
}
