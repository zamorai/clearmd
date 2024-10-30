'use client'

import { useState, useEffect } from 'react';
import MainHeroSection from '@/components/MainHeroSection';
import SalaryComparison from '@/components/SalaryComparison';
import CallToAction from '@/components/CallToAction';
import { supabase } from '../../lib/supabaseClient';

export default function HomePage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSubspecialty, setSelectedSubspecialty] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [subspecialties, setSubspecialties] = useState<string[]>([]);
  const [stats, setStats] = useState({
    averageSalary: '$0',
    topLocation: '-',
    popularSubspecialty: '-',
    dataPoints: '0',
  });

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      fetchSubspecialties(selectedSpecialty);
      fetchStats(selectedSpecialty, selectedSubspecialty);
    }
  }, [selectedSpecialty, selectedSubspecialty]);

  const fetchSpecialties = async () => {
    const { data, error } = await supabase
      .from('salaries')
      .select('specialty')
      .not('specialty', 'is', null);
    
    if (error) {
      console.error('Error fetching specialties:', error);
    } else {
      const uniqueSpecialties = [...new Set(data.map(item => item.specialty))].sort();
      setSpecialties(uniqueSpecialties);
    }
  };

  const fetchSubspecialties = async (specialty: string) => {
    const { data, error } = await supabase
      .from('salaries')
      .select('subspecialty')
      .eq('specialty', specialty)
      .not('subspecialty', 'is', null);
    
    if (error) {
      console.error('Error fetching subspecialties:', error);
    } else {
      const uniqueSubspecialties = [...new Set(data.map(item => item.subspecialty))].sort();
      setSubspecialties(uniqueSubspecialties);
    }
  };

  const fetchStats = async (specialty: string, subspecialty: string | null) => {
    let query = supabase
      .from('salaries')
      .select('*')
      .eq('specialty', specialty);

    if (subspecialty) {
      query = query.eq('subspecialty', subspecialty);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stats:', error);
    } else {
      // Calculate stats
      const averageSalary = data.reduce((sum, item) => sum + item.salary, 0) / data.length;
      
      const locationCounts = data.reduce((acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1;
        return acc;
      }, {});
      
      const topLocation = Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '-';

      const subspecialtyCounts = data.reduce((acc, item) => {
        if (item.subspecialty) {
          acc[item.subspecialty] = (acc[item.subspecialty] || 0) + 1;
        }
        return acc;
      }, {});

      const popularSubspecialty = Object.entries(subspecialtyCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '-';

      setStats({
        averageSalary: `$${Math.round(averageSalary).toLocaleString()}`,
        topLocation,
        popularSubspecialty,
        dataPoints: data.length.toString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-soft-gray">
      <MainHeroSection
        specialties={specialties}
        subspecialties={subspecialties}
        selectedSpecialty={selectedSpecialty}
        selectedSubspecialty={selectedSubspecialty}
        onSpecialtyChange={setSelectedSpecialty}
        onSubspecialtyChange={setSelectedSubspecialty}
        stats={stats}
      />
      <SalaryComparison
        selectedSpecialty={selectedSpecialty}
        selectedSubspecialty={selectedSubspecialty}
      />
      <CallToAction />
    </div>
  );
}