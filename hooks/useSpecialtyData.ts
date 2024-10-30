import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Specialty } from '../types/medical';

export function useSpecialtyData() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const { data, error } = await supabase
          .from('specialties')
          .select('*')
          .order('name');

        if (error) throw error;
        setSpecialties(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecialties();
  }, []);

  return { specialties, loading, error };
}