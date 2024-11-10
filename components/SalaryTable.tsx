'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, MapPinIcon, BriefcaseIcon, BuildingOffice2Icon, CalendarIcon } from '@heroicons/react/20/solid';

interface CompensationBreakdown {
  base: number;
  bonus?: number;
  stock?: number;
  other?: number;
}

interface SalaryData {
  id: string;
  specialty: string;
  subspecialty?: string;
  position: string;
  category: 'academia' | 'hospital' | 'research' | 'private_practice';
  location: string;
  yearsExperience: {
    total: number;
    role: number;
  };
  compensation: CompensationBreakdown;
  date: string;
}

const sampleSalaryData: SalaryData[] = [
  {
    id: '1',
    specialty: 'Cardiology',
    subspecialty: 'Interventional Cardiology',
    position: 'Associate Professor',
    category: 'academia',
    location: 'New York, NY',
    yearsExperience: {
      total: 12,
      role: 5
    },
    compensation: {
      base: 280000,
      bonus: 45000,
      other: 25000
    },
    date: '2024-01-15'
  },
  {
    id: '2',
    specialty: 'Cardiology',
    subspecialty: 'Electrophysiology',
    position: 'Department Head',
    category: 'hospital',
    location: 'Boston, MA',
    yearsExperience: {
      total: 15,
      role: 3
    },
    compensation: {
      base: 400000,
      bonus: 100000,
      stock: 50000
    },
    date: '2024-01-20'
  },
  {
    id: '3',
    specialty: 'Neurology',
    subspecialty: 'Movement Disorders',
    position: 'Senior Researcher',
    category: 'research',
    location: 'San Francisco, CA',
    yearsExperience: {
      total: 8,
      role: 4
    },
    compensation: {
      base: 220000,
      bonus: 30000,
      stock: 40000,
      other: 15000
    },
    date: '2024-01-25'
  },
  {
    id: '4',
    specialty: 'Orthopedics',
    subspecialty: 'Sports Medicine',
    position: 'Practice Owner',
    category: 'private_practice',
    location: 'Miami, FL',
    yearsExperience: {
      total: 18,
      role: 7
    },
    compensation: {
      base: 500000,
      bonus: 200000,
      other: 100000
    },
    date: '2024-02-01'
  },
  {
    id: '5',
    specialty: 'Cardiology',
    subspecialty: 'Non-invasive Cardiology',
    position: 'Assistant Professor',
    category: 'academia',
    location: 'Chicago, IL',
    yearsExperience: {
      total: 6,
      role: 2
    },
    compensation: {
      base: 240000,
      bonus: 30000,
      other: 20000
    },
    date: '2024-02-05'
  },
  {
    id: '6',
    specialty: 'Neurology',
    subspecialty: 'Stroke',
    position: 'Medical Director',
    category: 'hospital',
    location: 'Los Angeles, CA',
    yearsExperience: {
      total: 14,
      role: 4
    },
    compensation: {
      base: 380000,
      bonus: 80000,
      stock: 40000
    },
    date: '2024-02-10'
  },
  {
    id: '7',
    specialty: 'Pediatrics',
    subspecialty: 'Neonatology',
    position: 'Division Chief',
    category: 'hospital',
    location: 'Houston, TX',
    yearsExperience: {
      total: 16,
      role: 6
    },
    compensation: {
      base: 360000,
      bonus: 90000,
      stock: 30000,
      other: 20000
    },
    date: '2024-02-15'
  },
  {
    id: '8',
    specialty: 'Surgery',
    subspecialty: 'Cardiac Surgery',
    position: 'Senior Partner',
    category: 'private_practice',
    location: 'Seattle, WA',
    yearsExperience: {
      total: 20,
      role: 8
    },
    compensation: {
      base: 600000,
      bonus: 300000,
      other: 150000
    },
    date: '2024-02-20'
  },
  {
    id: '9',
    specialty: 'Radiology',
    subspecialty: 'Interventional Radiology',
    position: 'Research Director',
    category: 'research',
    location: 'Philadelphia, PA',
    yearsExperience: {
      total: 10,
      role: 3
    },
    compensation: {
      base: 300000,
      bonus: 50000,
      stock: 60000,
      other: 25000
    },
    date: '2024-02-25'
  },
  {
    id: '10',
    specialty: 'Anesthesiology',
    position: 'Staff Physician',
    category: 'hospital',
    location: 'Denver, CO',
    yearsExperience: {
      total: 5,
      role: 2
    },
    compensation: {
      base: 340000,
      bonus: 40000,
      other: 20000
    },
    date: '2024-03-01'
  }
];


interface SalaryTableProps {
  data: SalaryData[];
  itemsPerPage?: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const calculateTotal = (comp: CompensationBreakdown): number => {
  return comp.base + (comp.bonus || 0) + (comp.stock || 0) + (comp.other || 0);
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'academia':
      return <BuildingOffice2Icon className="w-6 h-6 text-gray-600" />;
    case 'hospital':
      return <BriefcaseIcon className="w-6 h-6 text-gray-600" />;
    case 'research':
      return <BuildingOffice2Icon className="w-6 h-6 text-gray-600" />;
    case 'private_practice':
      return <BriefcaseIcon className="w-6 h-6 text-gray-600" />;
    default:
      return <BuildingOffice2Icon className="w-6 h-6 text-gray-600" />;
  }
};

const ExpandedDetails: React.FC<{ data: SalaryData }> = ({ data }) => {
  return (
    <tr className="relative">
      <td colSpan={4} className="px-6 py-4 bg-white">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              {getCategoryIcon(data.category)}
              <div>
                <div className="font-medium">{data.position}</div>
                <div className="text-sm text-gray-500">{data.specialty}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{data.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 capitalize">{data.category.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(data.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Experience</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Years at Company</span>
                  <span className="text-sm font-medium">{data.yearsExperience.role} yrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Experience</span>
                  <span className="text-sm font-medium">{data.yearsExperience.total} yrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Compensation */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 mt-6">Compensation Breakdown</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Base Salary</div>
                <div className="text-lg font-semibold">{formatCurrency(data.compensation.base)}</div>
              </div>

              {data.compensation.stock && (
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500">Stock</div>
                  <div className="text-lg font-semibold">{formatCurrency(data.compensation.stock)}</div>
                </div>
              )}

              {data.compensation.bonus && (
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500">Annual Bonus</div>
                  <div className="text-lg font-semibold">{formatCurrency(data.compensation.bonus)}</div>
                </div>
              )}

              {data.compensation.other && (
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500">Other Compensation</div>
                  <div className="text-lg font-semibold">{formatCurrency(data.compensation.other)}</div>
                </div>
              )}

              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Total Compensation</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(calculateTotal(data.compensation))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

const SalaryTable: React.FC<SalaryTableProps> = ({ data, itemsPerPage = 40 }) => {
  const [sortColumn, setSortColumn] = useState<string>('compensation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue = sortColumn === 'compensation' ? calculateTotal(a.compensation) : a[sortColumn];
    let bValue = sortColumn === 'compensation' ? calculateTotal(b.compensation) : b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ column }: { column: string }) => {
    if (column !== sortColumn) return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 text-gray-700" />
      : <ChevronDownIcon className="w-4 h-4 text-gray-700" />;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th 
                onClick={() => handleSort('specialty')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-150"
              >
                <div className="flex items-center gap-2">
                  Specialty
                  <SortIcon column="specialty" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('position')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-150"
              >
                <div className="flex items-center gap-2">
                  Position
                  <SortIcon column="position" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('yearsExperience')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-150"
              >
                <div className="flex items-center gap-2">
                  Years of Experience
                  <SortIcon column="yearsExperience" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('compensation')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-150"
              >
                <div className="flex items-center gap-2">
                  Total Compensation (USD)
                  <SortIcon column="compensation" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.map((row, idx) => (
              <React.Fragment key={row.id}>
                <tr 
                  className={`
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${expandedRow === row.id ? 'border-b-0 bg-white relative z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]' : ''}
                    hover:bg-gray-100 cursor-pointer transition-colors
                  `}
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{row.specialty}</div>
                    {row.subspecialty && (
                      <div className="text-sm text-gray-500">{row.subspecialty}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{row.position}</div>
                    <div className="text-sm text-gray-500 capitalize">{row.category.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{row.yearsExperience.total} yrs total</div>
                    <div className="text-sm text-gray-500">{row.yearsExperience.role} yrs in role</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(calculateTotal(row.compensation))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Base: {formatCurrency(row.compensation.base)}
                    </div>
                  </td>
                </tr>
                {expandedRow === row.id && (
                  <ExpandedDetails data={row} />
                )}
              </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryTable;