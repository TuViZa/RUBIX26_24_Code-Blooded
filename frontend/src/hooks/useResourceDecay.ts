import { useEffect, useState, useCallback } from 'react'
<<<<<<< Updated upstream
import { supabase } from '@/lib/supabaseClient'
=======
import { supabaseServices } from '@/lib/supabase-services'
>>>>>>> Stashed changes

export function useResourceDecay() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
<<<<<<< Updated upstream
    const { data, error } = await supabase
      .from("resource_usage")
      .select("*");

    setResources(Array.isArray(data) ? data : []);
=======
    try {
      // Get resource usage from Supabase
      const data = await supabaseServices.resource.getUsage()
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching resource usage:', error);
      setResources([]);
    }
>>>>>>> Stashed changes
    setLoading(false);
  };

  useEffect(() => {
    fetchData()
<<<<<<< Updated upstream
=======
    
    // Listen for real-time updates from Supabase
    const unsubscribe = supabaseServices.resource.listenToUsage((data) => {
      setResources(Array.isArray(data) ? data : []);
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
>>>>>>> Stashed changes
  }, [])

  return {
    resources: Array.isArray(resources) ? resources : [],
    loading,
    error: null,
  };
}
