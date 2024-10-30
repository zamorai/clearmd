'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

import { Menu } from '@headlessui/react';
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

const formatCurrency = (value) => {
  if (!value) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const formatYAxis = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const AggregatedCompensationView: React.FC = () => {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [aggregatedData, setAggregatedData] = useState<any>(null);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      fetchAggregatedData();
    }
  }, [selectedSpecialty]);

  const fetchSpecialties = async () => {
    const { data, error } = await supabase
      .from('salaries')
      .select('specialty')
      .not('specialty', 'is', null)
      .then(result => {
        // Get unique values using a Set
        const uniqueSpecialties = [...new Set(result.data?.map(item => item.specialty))].sort();
        return { data: uniqueSpecialties, error: result.error };
      });
    
    if (error) {
      console.error('Error fetching specialties:', error);
    } else {
      setSpecialties(data || []);
    }
  };

  const fetchAggregatedData = async () => {
    const { data, error } = await supabase
      .from('salaries')
      .select('*')
      .eq('specialty', selectedSpecialty);
    
    if (error) {
      console.error('Error fetching aggregated data:', error);
    } else {
      processAggregatedData(data);
    }
  };

  const processAggregatedData = (data) => {
    const categories = ['academia', 'hospital', 'private_practice', 'research'];
    const processed = {
      averageSalaries: [],
      experienceData: [],
      locationData: {},
      detailedData: data,
    };

    categories.forEach(category => {
      const categoryData = data.filter(item => item.category === category);
      const avgSalary = categoryData.reduce((sum, item) => sum + item.salary, 0) / categoryData.length;
      processed.averageSalaries.push({ category, avgSalary });

      const expData = categoryData.map(item => ({ years: item.years_experience, salary: item.salary }));
      processed.experienceData.push({ category, data: expData });

      const locations = categoryData.reduce((acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1;
        return acc;
      }, {});
      processed.locationData[category] = locations;
    });

    setAggregatedData(processed);
  };


  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedSpecialty || 'Select a Specialty'}
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive compensation data and insights
          </p>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex justify-between items-center w-64 rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            {selectedSpecialty || 'Select Specialty'}
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
            {specialties.map((specialty) => (
              <Menu.Item key={specialty}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } w-full text-left px-4 py-2 text-sm text-gray-900`}
                    onClick={() => setSelectedSpecialty(specialty)}
                  >
                    {specialty}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>

      {aggregatedData && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Data Points"
              value={aggregatedData.detailedData.length.toLocaleString()}
              description="Active salary reports"
              icon={Users}
              trend={12}
            />
            <StatCard
              title="Average Compensation"
              value={formatCurrency(
                aggregatedData.averageSalaries.reduce((sum, item) => sum + item.avgSalary, 0) / 
                aggregatedData.averageSalaries.length
              )}
              description="Across all categories"
              icon={TrendingUp}
              trend={8}
            />
            <StatCard
              title="Private vs Academic"
              value={`${formatCurrency(
                aggregatedData.averageSalaries.find(item => item.category === 'private_practice')?.avgSalary
              )} / ${formatCurrency(
                aggregatedData.averageSalaries.find(item => item.category === 'academia')?.avgSalary
              )}`}
              description="Private practice vs Academic salary"
              icon={Building2}
            />
            <StatCard
              title="Experience Premium"
              value="45%"
              description="Salary increase per 5 years"
              icon={GraduationCap}
              trend={5}
            />
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Category Comparison */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Average Salary by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregatedData.averageSalaries} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
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
                    dataKey="avgSalary"
                    fill="#818CF8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Experience Trend */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Salary by Experience</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={aggregatedData.experienceData.flatMap(cat => cat.data)}
                  margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
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
            </div>
          </div>

          {/* Location Analysis */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Top Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(aggregatedData.locationData).map(([category, locations]) => (
                <div key={category} className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-4 capitalize">{category}</h3>
                  <ul className="space-y-3">
                    {Object.entries(locations as Record<string, number>)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([location, count], index) => (
                        <li key={location} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{location}</span>
                          <span className="text-sm font-medium text-gray-900">{count} reports</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Data Table */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detailed Salary Reports</h2>
            <SalaryTable data={aggregatedData.detailedData} />
          </div>
        </>
      )}
    </div>
  );
};

export default AggregatedCompensationView;