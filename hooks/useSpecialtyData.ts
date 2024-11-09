import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Specialty {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  avg_years_education?: number;
}

export interface Subspecialty {
  id: string;
  specialty_id: string;
  name: string;
}

export function useSpecialtyData() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const { data, error } = await supabase
          .from('specialties')
          .select(`
            id,
            name,
            color,
            icon,
            description,
            avg_years_education
          `)
          .order('name');

        if (error) throw error;
        setSpecialties(data || []);
      } catch (e) {
        console.error('Error fetching specialties:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecialties();
  }, []);

  return { specialties, loading, error };
}

export function useSubspecialtyData(specialtyId: string | null) {
  const [subspecialties, setSubspecialties] = useState<Subspecialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSubspecialties() {
      if (!specialtyId) {
        setSubspecialties([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('subspecialties')
          .select(`
            id,
            specialty_id,
            name
          `)
          .eq('specialty_id', specialtyId)
          .order('name');

        if (error) throw error;
        setSubspecialties(data || []);
      } catch (e) {
        console.error('Error fetching subspecialties:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubspecialties();
  }, [specialtyId]);

  return { subspecialties, loading, error };
}

export interface Position {
  id: string;
  title: string;
  category_id: string;
  level_id: string;
}

export interface Category {
  id: string;
  name: string;
  display_name: string;
}

export function usePositionData(categoryId: string | null) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('employment_categories')
          .select('id, name, display_name')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (e) {
        console.error('Error fetching categories:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Fetch positions when category changes
  useEffect(() => {
    async function fetchPositions() {
      if (!categoryId) {
        setPositions([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('positions')
          .select(`
            id,
            title,
            category_id,
            level_id
          `)
          .eq('category_id', categoryId)
          .order('title');

        if (error) throw error;
        setPositions(data || []);
      } catch (e) {
        console.error('Error fetching positions:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPositions();
  }, [categoryId]);

  return { positions, categories, loading, error };
}

export const useSpecialtyAndSubspecialtyIds = (specialtyName: string, subspecialtyName: string | null) => {
  const [specialtyId, setSpecialtyId] = useState<string | null>(null);
  const [subspecialtyId, setSubspecialtyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIds = async () => {
      setLoading(true);
      setError(null);

      const { data: specialtyData, error: specialtyError } = await supabase
        .from('specialties')
        .select('id')
        .ilike('name', specialtyName)
        .single();

      if (specialtyError) {
        console.error('Error fetching specialty ID:', specialtyError);
        setError('Error fetching specialty ID');
        setLoading(false);
        return;
      }

      const fetchedSpecialtyId = specialtyData?.id;
      setSpecialtyId(fetchedSpecialtyId);

      if (!subspecialtyName) {
        setLoading(false);
        return;
      }

      const { data: subspecialtyData, error: subspecialtyError } = await supabase
        .from('subspecialties')
        .select('id')
        .eq('specialty_id', fetchedSpecialtyId)
        .ilike('name', subspecialtyName)
        .single();

      if (subspecialtyError) {
        console.error('Error fetching subspecialty ID:', subspecialtyError);
        setError('Error fetching subspecialty ID');
      } else {
        setSubspecialtyId(subspecialtyData?.id);
      }

      setLoading(false);
    };

    fetchIds();
  }, [specialtyName, subspecialtyName]);

  return { specialtyId, subspecialtyId, loading, error };
};