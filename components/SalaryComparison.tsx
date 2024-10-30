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
interface Position {
  title: string;
  baseSalary: number;
  rvu?: number;
  partnership?: number;
  bonus?: number;
  totalComp: number;
}

interface SalaryComparisonProps {
  selectedSpecialty: string;
  selectedSubspecialty: string;
}

const categories = ['Academia', 'Research', 'Hospital', 'Private'];
const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston'];

const SalaryComparison: React.FC<SalaryComparisonProps> = ({
  selectedSpecialty,
  selectedSubspecialty,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, Position[]>>({
    Academia: [],
    Research: [],
    Hospital: [],
    Private: [],
  });

  // Mock data - replace with actual data fetch
  useEffect(() => {
    const mockData = {
      Academia: [
        { title: 'Assistant Professor', baseSalary: 150000, rvu: 30000, totalComp: 180000 },
        { title: 'Associate Professor', baseSalary: 180000, rvu: 40000, totalComp: 220000 },
        { title: 'Full Professor', baseSalary: 220000, rvu: 50000, totalComp: 270000 },
      ],
      Research: [
        { title: 'Research Associate', baseSalary: 130000, bonus: 20000, totalComp: 150000 },
        { title: 'Senior Researcher', baseSalary: 160000, bonus: 30000, totalComp: 190000 },
      ],
      Hospital: [
        { title: 'Staff Physician', baseSalary: 200000, rvu: 50000, totalComp: 250000 },
        { title: 'Department Head', baseSalary: 250000, rvu: 70000, totalComp: 320000 },
      ],
      Private: [
        { title: 'Private Practice', baseSalary: 220000, partnership: 100000, totalComp: 320000 },
        { title: 'Partner', baseSalary: 300000, partnership: 150000, totalComp: 450000 },
      ],
    };

    setPositions(mockData);
  }, [selectedSpecialty, selectedSubspecialty, selectedLocation]);

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">Salary Comparison</h2>
          <div className="ml-8">
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex w-48 justify-between items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50">
                {selectedLocation}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Menu.Items className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {locations.map((location) => (
                    <Menu.Item key={location}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedLocation(location)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                        >
                          {location}
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
                        {positions[category].map((position) => (
                          <motion.div
                            key={position.title}
                            onHoverStart={() => setHoveredPosition(position.title)}
                            onHoverEnd={() => setHoveredPosition(null)}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-200
                              ${
                                hoveredPosition === position.title
                                  ? 'bg-indigo-50 shadow-sm'
                                  : 'hover:bg-white hover:shadow-sm'
                              }`}
                          >
                            <h3 className="font-medium text-gray-900">{position.title}</h3>
                            <p className="text-sm text-gray-500">
                              Total: ${position.totalComp.toLocaleString()}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="col-span-9">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={positions[category].map(position => ({
                            ...position,
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
                          {[
                            { key: 'baseSalary', name: 'Base Salary' },
                            { key: 'rvu', name: 'RVU' },
                            { key: 'partnership', name: 'Partnership' },
                            { key: 'bonus', name: 'Bonus' }
                          ].map(({ key, name }) => (
                            <Bar
                              key={key}
                              dataKey={key}
                              name={name}
                              stackId="compensation"
                              fill={chartColors[key].fill}
                              stroke="none"
                              radius={[4, 4, 0, 0]}
                              onMouseOver={() => {
                                // Update hover state for animation if needed
                              }}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Legend */}
                      <div className="flex justify-center gap-8 mt-8">
                        {Object.entries(chartColors).map(([key, { fill }]) => (
                          <div key={key} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded mr-2"
                              style={{ backgroundColor: fill }}
                            />
                            <span className="text-sm text-gray-600 font-medium">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
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