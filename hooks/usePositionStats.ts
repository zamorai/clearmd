import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface PositionStats {
  title: string;
  base_salary: number;
  bonus: number;
  other_compensation: number;
  total_compensation: number;
  count: number;
}

interface GroupedPositionStats {
  [category: string]: PositionStats[];
}

export function usePositionStats(
  specialtyId: string | null, 
  subspecialtyId: string | null,
  location: string | null
) {
  const [data, setData] = useState<GroupedPositionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!specialtyId) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        // First get the base salary data
        let query = supabase
          .from('salaries')
          .select(`
            position_id,
            base_salary,
            bonus,
            other_compensation,
            total_compensation,
            locations(city)
          `)
          .eq('specialty_id', specialtyId);

        if (subspecialtyId) {
          query = query.eq('subspecialty_id', subspecialtyId);
        }

        if (location) {
          query = query.eq('locations.city', location);
        }

        const { data: salaries, error: salaryError } = await query;
        if (salaryError) throw salaryError;

        // Then get the positions data with categories
        const { data: positions, error: positionError } = await supabase
          .from('positions')
          .select(`
            id,
            title,
            category_id,
            employment_categories(name)
          `);
        if (positionError) throw positionError;

        // Map positions to a lookup object
        const positionMap = positions.reduce((acc, pos) => {
          acc[pos.id] = {
            title: pos.title,
            category: pos.employment_categories.name
          };
          return acc;
        }, {});

        // Group and calculate averages
        const grouped = salaries.reduce((acc, salary) => {
          const position = positionMap[salary.position_id];
          if (!position) return acc;

          const category = position.category;
          const title = position.title;

          if (!acc[category]) {
            acc[category] = {};
          }

          if (!acc[category][title]) {
            acc[category][title] = {
              count: 0,
              base_salary: 0,
              bonus: 0,
              other_compensation: 0,
              total_compensation: 0
            };
          }

          acc[category][title].count++;
          acc[category][title].base_salary += salary.base_salary;
          acc[category][title].bonus += salary.bonus || 0;
          acc[category][title].other_compensation += salary.other_compensation || 0;
          acc[category][title].total_compensation += salary.total_compensation;

          return acc;
        }, {});

        // Calculate averages and format data
        const formattedData = Object.entries(grouped).reduce((acc, [category, positions]) => {
          acc[category] = Object.entries(positions).map(([title, stats]) => ({
            title,
            base_salary: Math.round(stats.base_salary / stats.count),
            bonus: Math.round(stats.bonus / stats.count),
            other_compensation: Math.round(stats.other_compensation / stats.count),
            total_compensation: Math.round(stats.total_compensation / stats.count),
            count: stats.count
          }));
          return acc;
        }, {} as GroupedPositionStats);

        setData(formattedData);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [specialtyId, subspecialtyId, location]);

  return { data, loading, error };
}