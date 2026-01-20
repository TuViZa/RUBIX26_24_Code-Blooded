import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useResourceDecay() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("resource_usage")
      .select("*");

    setResources(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData()
  }, [])

  return {
    resources: Array.isArray(resources) ? resources : [],
    loading,
    error: null,
  };
}
