import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Category {
  id: string;
  display_name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('employment_categories')
          .select('id, display_name')

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

  return { categories, loading, error };
}