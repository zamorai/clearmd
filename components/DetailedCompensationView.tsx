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
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import SalaryTable from './SalaryTable';
import { 
  Building2, 
  TrendingUp, 
  MapPin,
  Users,
  GraduationCap,
  ChartBar,
  Briefcase,
  ClipboardList
} from 'lucide-react';
import FilterDropdowns from './FilterDropdowns';

// Category-specific configurations
const categoryConfig = {
  academia: {
    title: 'Academic Medicine',
    metrics: {
      primary: 'Publications',
      secondary: 'Grant Funding',
      tertiary: 'Teaching Hours'
    },
    positions: [
      'Assistant Professor',
      'Associate Professor',
      'Professor',
      'Department Chair',
      'Dean'
    ],
    color: '#818CF8' // Indigo
  },
  hospital: {
    title: 'Hospital Practice',
    metrics: {
      primary: 'Patient Load',
      secondary: 'RVUs',
      tertiary: 'On-Call Hours'
    },
    positions: [
      'Staff Physician',
      'Department Head',
      'Chief of Service',
      'Medical Director'
    ],
    color: '#34D399' // Emerald
  },
  private_practice: {
    title: 'Private Practice',
    metrics: {
      primary: 'Patient Volume',
      secondary: 'Practice Revenue',
      tertiary: 'Partnership Track'
    },
    positions: [
      'Associate',
      'Partner',
      'Senior Partner',
      'Practice Owner'
    ],
    color: '#F472B6' // Pink
  },
  research: {
    title: 'Research',
    metrics: {
      primary: 'Research Grants',
      secondary: 'Publications',
      tertiary: 'Patents'
    },
    positions: [
      'Research Scientist',
      'Senior Researcher',
      'Lab Director',
      'Research Director'
    ],
    color: '#60A5FA' // Blue
  }
};

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

interface DetailedCompensationViewProps {
  category: 'academia' | 'hospital' | 'private_practice' | 'research';
}

const DetailedCompensationView: React.FC<DetailedCompensationViewProps> = ({ category }) => {
  const [filters, setFilters] = useState({
    specialty: '',
    subspecialty: '',
    location: '',
    position: ''
  });
  const [summaryData, setSummaryData] = useState(null);
  const [salaryData, setSalaryData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [category, filters]);

  const fetchData = async () => {
    // Fetch summary data
    const { data: summaryData, error: summaryError } = await supabase
      .from('salary_summaries')
      .select('*')
      .eq('category', category)
      .single();

    if (summaryError) {
      console.error('Error fetching summary data:', summaryError);
    } else {
      setSummaryData(summaryData);
    }

    // Fetch detailed salary data
    let query = supabase
      .from('salaries')
      .select('*')
      .eq('category', category);

    // Apply filters
    if (filters.specialty) query = query.eq('specialty', filters.specialty);
    if (filters.subspecialty) query = query.eq('subspecialty', filters.subspecialty);
    if (filters.location) query = query.eq('location', filters.location);
    if (filters.position) query = query.eq('position', filters.position);

    const { data: salaryData, error: salaryError } = await query;

    if (salaryError) {
      console.error('Error fetching salary data:', salaryError);
    } else {
      setSalaryData(salaryData);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const config = categoryConfig[category];

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-wrap gap-4">
        <FilterDropdowns filters={filters} onFilterChange={handleFilterChange} />
      </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Average Compensation"
          value={formatCurrency(summaryData?.averageComp)}
          description="Total compensation including benefits"
          icon={Building2}
          trend={5}
        />
        <StatCard
          title="Experience Premium"
          value="+45%"
          description="Salary increase per 5 years"
          icon={TrendingUp}
          trend={8}
        />
        <StatCard
          title="Top Location"
          value="New York"
          description="Highest paying region"
          icon={MapPin}
        />
        <StatCard
          title={config.metrics.primary}
          value={summaryData?.[config.metrics.primary.toLowerCase()]}
          description={`Average ${config.metrics.primary.toLowerCase()}`}
          icon={ChartBar}
          trend={12}
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Compensation by Position */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Compensation by Position</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={salaryData}
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="position"
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
                fill={config.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Experience Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Experience vs. Compensation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={experienceData}
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            >
              <defs>
                <linearGradient id={`color${category}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={config.color} stopOpacity={0.01}/>
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
                stroke={config.color}
                fillOpacity={1}
                fill={`url(#color${category})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category-Specific Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Key Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(config.metrics).map(([key, metric]) => (
            <div key={key} className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-4">{metric}</h3>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={trendData}>
                  <Line
                    type="monotone"
                    dataKey={metric.toLowerCase().replace(' ', '_')}
                    stroke={config.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <XAxis hide={true} />
                  <YAxis hide={true} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 12 months</span>
                <span className="text-sm font-medium text-gray-900">+12.5%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Data Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Detailed Reports</h2>
        <SalaryTable data={salaryData} />
      </div>
    </div>
  );
};

export default DetailedCompensationView;