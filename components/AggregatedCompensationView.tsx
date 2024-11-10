'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSearchParams, useRouter } from 'next/navigation';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import SalaryTable from './SalaryTable';
import { 
  Users, 
  TrendingUp, 
  Building2, 
  GraduationCap 
} from 'lucide-react';
import SpecialtySelector from './SpecialtySelector';
import { useSpecialtyAndSubspecialtyIds } from '../hooks/useSpecialtyData';
import { useCategories } from '../hooks/useCategories';
import { useSpecialtyStats } from '../hooks/useStatistics';
import { formatCurrency } from '../utils/numberUtils';

const StatCard = ({ title, value, description, icon: Icon, trend = null }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
        {trend && (
          <p className={`mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last year
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-50">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
      </div>
    </div>
  </div>
);

const formatYAxis = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const AggregatedCompensationView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialtyName = searchParams.get('specialty') ?? null;
  const subspecialtyName = searchParams.get('subspecialty') ?? null;
  
  const { specialtyId, subspecialtyId, loading, error } = useSpecialtyAndSubspecialtyIds(
    specialtyName,
    subspecialtyName
  );
  
  const { categories } = useCategories();
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [selectedSubspecialtyId, setSelectedSubspecialtyId] = useState<string | null>(null);
  const [aggregatedData, setAggregatedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { stats } = useSpecialtyStats(selectedSpecialtyId, selectedSubspecialtyId);

  // Update URL when IDs change
  useEffect(() => {
    if (selectedSpecialtyId) {
      const updateURL = async () => {
        try {
          // Get specialty name
          const { data: specialtyData } = await supabase
            .from('specialties')
            .select('name')
            .eq('id', selectedSpecialtyId)
            .single();
          
          const params = new URLSearchParams(searchParams);
          params.set('specialty', specialtyData?.name || '');
          
          // Handle subspecialty
          if (selectedSubspecialtyId) {
            const { data: subData } = await supabase
              .from('subspecialties')
              .select('name')
              .eq('id', selectedSubspecialtyId)
              .single();
            
            if (subData?.name) {
              params.set('subspecialty', subData.name);
            }
          } else {
            params.delete('subspecialty');
            // Force a data refresh when subspecialty is deselected
            fetchAggregatedData(selectedSpecialtyId, null);
          }
  
          router.push(`?${params.toString()}`);
        } catch (error) {
          console.error('Error updating URL:', error);
        }
      };
  
      updateURL();
    }
  }, [selectedSpecialtyId, selectedSubspecialtyId]);

  // Set selected IDs from URL params
  useEffect(() => {
    if (specialtyId) {
      setSelectedSpecialtyId(specialtyId);
      setSelectedSubspecialtyId(subspecialtyId);
    }
  }, [specialtyId, subspecialtyId]);

  // Your existing data fetching effect
  useEffect(() => {
    if (specialtyId) {
      fetchAggregatedData(specialtyId, subspecialtyId);
    }
  }, [specialtyId, subspecialtyId]);

  const fetchAggregatedData = async (specialtyId: string, subspecialtyId: string | null) => {
    setIsLoading(true);
    try {
      console.log('Fetching data with:', { specialtyId, subspecialtyId });
      let query = supabase
        .from('salaries')
        .select('*')
        .eq('specialty_id', specialtyId);
      
      if (subspecialtyId) {
        query = query.eq('subspecialty_id', subspecialtyId);
      }
      
      const { data, error } = await query;
      console.log('Fetched data:', { count: data?.length, error });
      
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        await processAggregatedData(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

    const processAggregatedData = async (data: any[]) => {
      const { data: specialtiesData } = await supabase
      .from('specialties')
      .select('id, name');
    
      const { data: subspecialtiesData } = await supabase
        .from('subspecialties')
        .select('id, name');
        
      const { data: positionsData } = await supabase
        .from('positions')
        .select(`
          id, 
          title,
          employment_categories (
            id,
            name,
            display_name
          )
        `);
        
      const { data: locationsData } = await supabase
        .from('locations')
        .select('id, city, state');

      const mapCategory = (dbCategory: string): 'academia' | 'hospital' | 'research' | 'private_practice' => {
        const categoryMap = {
          'academic_medicine': 'academia',
          'hospital_based': 'hospital',
          'research_development': 'research',
          'private_practice': 'private_practice'
        };
        return categoryMap[dbCategory] || 'hospital';
      };

      // Create lookup maps
      const specialtyMap = Object.fromEntries(specialtiesData?.map(s => [s.id, s.name]) ?? []);
      const subspecialtyMap = Object.fromEntries(subspecialtiesData?.map(s => [s.id, s.name]) ?? []);
      const positionMap = Object.fromEntries(positionsData?.map(p => [p.id, {
        title: p.title,
        category: p.employment_categories[0]?.name
      }]) ?? []);
      const locationMap = Object.fromEntries(locationsData?.map(l => [l.id, `${l.city}, ${l.state}`]) ?? []);

      const processed = {
        averageSalaries: [], // Your existing averageSalaries processing
        experienceData: [], // Your existing experienceData processing
        detailedData: data.map(item => ({
          id: item.id,
          specialty: specialtyMap[item.specialty_id] || 'Unknown',
          subspecialty: item.subspecialty_id ? subspecialtyMap[item.subspecialty_id] : undefined,
          position: positionMap[item.position_id]?.title || 'Unknown',
          category: mapCategory(item.category_id), // Map to expected category format
          location: locationMap[item.location_id] || 'Unknown',
          yearsExperience: {
            total: item.years_experience,
            role: item.years_experience // Since we don't store years_in_role separately
          },
          compensation: {
            base: item.base_salary,
            bonus: item.bonus || undefined,
            other: item.other_compensation || undefined
          },
          date: item.created_at
        }))
      };

    categories.forEach(category => {
      const categoryData = data.filter(item => item.category_id === category.id);
      const salary = categoryData.reduce((sum, item) => sum + item.total_compensation, 0) / categoryData.length;
      processed.averageSalaries.push({ category: category['display_name'], salary });

      const expData = categoryData.map(item => ({ years: item.years_experience, salary: item.total_compensation }));
      expData.sort()
      processed.experienceData.push({ category: category['display_name'], data: expData });
    });

    setAggregatedData(processed);
  };


  return (
    <div className="w-full">
      {/* Header Section */}

        <div className="max-w-7xl mx-auto pb-6">
    
          
          {/* Filters Section */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <SpecialtySelector
              selectedSpecialty={selectedSpecialtyId}
              selectedSubspecialty={selectedSubspecialtyId}
              onSpecialtyChange={setSelectedSpecialtyId}
              onSubspecialtyChange={setSelectedSubspecialtyId}
              className="flex-1"
            />
          </div>
 
      </div>

      {aggregatedData && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard
              title="Average Compensation"
              value={formatCurrency(stats?.stats?.overview.avg_total_comp)}
              description={`${specialtyName} ${subspecialtyName ? '- ' + subspecialtyName : ''}`}
              icon={TrendingUp}
              // trend={8}
            />
            <StatCard
              title="Total Data Points"
              value={stats?.stats?.overview.total_entries}
              description="Active salary reports"
              icon={Users}
              // trend={12}
            />
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Category Comparison */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Average Salary by Category</h2>
              {isLoading ? (
              <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregatedData.averageSalaries} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="salary"
                    fill="#818CF8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>

            {/* Experience Trend */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Salary by Experience</h2>
              {isLoading ? (
              <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={aggregatedData.experienceData.flatMap(cat => cat.data).sort((a, b) => a.years - b.years)}
                  margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818CF8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#818CF8" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="years"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="salary"
                    stroke="#818CF8"
                    fillOpacity={1}
                    fill="url(#colorSalary)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Detailed Data Table */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detailed Salary Reports</h2>
            {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : (
            <SalaryTable data={aggregatedData.detailedData} />
          )}
          </div>
        </>
      )}
    </div>
  );
};

export default AggregatedCompensationView;