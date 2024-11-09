'use client';

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { usePositionStats } from '../hooks/usePositionStats';
import { supabase } from '../lib/supabaseClient';

// Custom tooltip component for cleaner tooltips
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
      <p className="font-medium text-gray-900 mb-2">{label}</p>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-600">{item.name}:</span>
          <span className="text-sm font-medium text-gray-900">
            ${item.value.toLocaleString()}
          </span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="text-sm font-medium text-gray-900">
            ${payload.reduce((sum, item) => sum + (item.value || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Custom Y-Axis tick formatter
const formatYAxis = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

// Chart theme colors
const chartColors = {
  baseSalary: {
    fill: '#818CF8',
    hover: '#6366F1'
  },
  rvu: {
    fill: '#60A5FA',
    hover: '#3B82F6'
  },
  partnership: {
    fill: '#34D399',
    hover: '#10B981'
  },
  bonus: {
    fill: '#FBBF24',
    hover: '#F59E0B'
  }
};
type Location = {
  city: string;
  state: string;
  count: number;
};

interface SalaryComparisonProps {
  selectedSpecialty: string;
  selectedSubspecialty: string;
}

const categories = ['academic_medicine', 'research_development', 'hospital_based', 'private_practice'];

const SalaryComparison: React.FC<SalaryComparisonProps> = ({
  selectedSpecialty,
  selectedSubspecialty,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const { data: positionData, loading, error } = usePositionStats(
    selectedSpecialty,
    selectedSubspecialty, 
    selectedLocation
  );
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);

  console.log(positionData)

  useEffect(() => {
    async function fetchLocations() {
      if (!selectedSpecialty) return;

      const query = supabase
        .from('salaries')
        .select(`
          locations (
            city,
            state
          )
        `)
        .eq('specialty_id', selectedSpecialty);

      if (selectedSubspecialty) {
        query.eq('subspecialty_id', selectedSubspecialty);
      }

      const { data } = await query;
      
      if (data) {
        // Process unique locations with counts
        const locationCounts = data.reduce((acc, record) => {
          const key = `${record.locations.city}, ${record.locations.state}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const locations = Object.entries(locationCounts).map(([location, count]) => {
          const [city, state] = location.split(', ');
          return {
            city,
            state,
            count: count as number
          };
        });

        setAvailableLocations(locations);
      }
    }

    fetchLocations();
  }, [selectedSpecialty, selectedSubspecialty]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-xl"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl">
        <p className="text-red-700">Failed to load salary data</p>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">Salary Comparison</h2>
          <div className="ml-8">
          <Menu as="div" className="relative">
      <Menu.Button className="inline-flex w-48 justify-between items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50">
        {selectedLocation ? `${selectedLocation}` : 'All Locations'}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-96 overflow-auto">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setSelectedLocation(null)}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex justify-between items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                <span>All Locations</span>
                <span className="text-gray-500 text-xs">
                  {availableLocations.reduce((sum, loc) => sum + loc.count, 0)} reports
                </span>
              </button>
            )}
          </Menu.Item>
          <div className="border-t border-gray-100 my-1" />
          {availableLocations
            .sort((a, b) => b.count - a.count) // Sort by count descending
            .map((location) => (
              <Menu.Item key={`${location.city}-${location.state}`}>
                {({ active }) => (
                  <button
                    onClick={() => setSelectedLocation(location.city)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex justify-between items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <span>{`${location.city}, ${location.state}`}</span>
                    <span className="text-gray-500 text-xs">
                      {location.count} reports
                    </span>
                  </button>
                )}
              </Menu.Item>
            ))}
        </div>
      </Menu.Items>
    </Menu>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <Tab.Group>
            <Tab.List className="flex border-b border-gray-200">
              {categories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `flex-1 py-4 px-4 text-sm font-medium text-center focus:outline-none transition-colors duration-200
                    ${
                      selected
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="p-6">
              {categories.map((category) => (
                <Tab.Panel key={category} className="focus:outline-none">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Position List */}
                    <div className="col-span-3 bg-gray-50/50 rounded-xl p-4">
                      <div className="space-y-2">
                        {positionData?.[category]?.map((position) => (
                          <motion.div
                            key={position.title}
                            onHoverStart={() => setHoveredPosition(position.title)}
                            onHoverEnd={() => setHoveredPosition(null)}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-200
                              ${hoveredPosition === position.title
                                ? 'bg-indigo-50 shadow-sm'
                                : 'hover:bg-white hover:shadow-sm'
                              }`}
                          >
                            <h3 className="font-medium text-gray-900">{position.title}</h3>
                            <p className="text-sm text-gray-500">
                              Total: ${position.total_compensation.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              Based on {position.count} reports
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="col-span-9">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={positionData?.[category]?.map(position => ({
                            title: position.title,
                            base: position.base_salary,
                            bonus: position.bonus || 0,
                            other: position.other_compensation || 0,
                            total: position.total_compensation,
                            opacity: hoveredPosition ? (position.title === hoveredPosition ? 1 : 0.3) : 1
                          }))}
                          margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
                          barSize={120}
                        >
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            vertical={false}
                            stroke="#E5E7EB"
                          />
                          <XAxis 
                            dataKey="title"
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fill: '#6B7280',
                              fontSize: 12,
                              fontWeight: 500
                            }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fill: '#6B7280',
                              fontSize: 12
                            }}
                            tickFormatter={formatYAxis}
                            dx={-10}
                          />
                          <Tooltip 
                            content={<CustomTooltip />}
                            coordinate={{x: 0, y: 0}}
                            cursor={{ fill: 'transparent' }}
                          />
                          <Bar 
                            dataKey="base" 
                            name="Base Salary" 
                            stackId="a"
                            fill={chartColors.baseSalary.fill}
                          />
                          <Bar 
                            dataKey="bonus" 
                            name="Bonus" 
                            stackId="a"
                            fill={chartColors.bonus.fill}
                          />
                          <Bar 
                            dataKey="other" 
                            name="Other" 
                            stackId="a"
                            fill={chartColors.partnership.fill}
                          />
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Legend */}
                      <div className="flex justify-center gap-8 mt-8">
                        {[
                          { key: 'base', name: 'Base Salary', color: chartColors.baseSalary.fill },
                          { key: 'bonus', name: 'Bonus', color: chartColors.bonus.fill },
                          { key: 'other', name: 'Other', color: chartColors.partnership.fill }
                        ].map(({ key, name, color }) => (
                          <div key={key} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded mr-2"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              {name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default SalaryComparison;