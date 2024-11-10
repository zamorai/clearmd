import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export interface SpecialtyStats {
  specialty_name: string;
  subspecialty_name?: string;
  specialty_color: string;
  overview: {
    total_entries: number;
    avg_base_salary: number;
    avg_total_comp: number;
    avg_years_experience: number;
    avg_hours_worked: number;
    total_submissions: number;
  };
  compensation_by_category: {
    [key: string]: {
      count: number;
      avg_total_comp: number;
      min_total_comp: number;
      max_total_comp: number;
    };
  };
  demographics: {
    gender: {
      male: number;
      female: number;
      other: number;
      prefer_not_to_say: number;
    };
    experience_ranges: {
      entry: number;
      mid: number;
      senior: number;
    };
    most_common_location: string;
  };
}

export function useSpecialtyStats(
  specialtyId: string | null, 
  subspecialtyId: string | null = null
) {
  const [stats, setStats] = useState<SpecialtyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!specialtyId) {
        setStats(null);
        return;
      }
  
      setLoading(true);
      try {
        let query = supabase
          .from('specialty_detailed_stats')
          .select('*')
          .eq('specialty_id', specialtyId);
  
        if (subspecialtyId) {
          // If subspecialty is specified, get exact match
          query = query.eq('subspecialty_id', subspecialtyId);
        } else {
          // If no subspecialty specified, get the row with null subspecialty_id
          query = query.is('subspecialty_id', null);
        }
  
        const { data, error } = await query.single();
        if (error) throw error;
        setStats(data);
      } catch (e) {
        console.error('Error fetching specialty stats:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchStats();
  }, [specialtyId, subspecialtyId]);

  return { stats, loading, error };
}