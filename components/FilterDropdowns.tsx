import React from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface FilterDropdownsProps {
  filters: {
    specialty: string;
    subspecialty: string;
    location: string;
    position: string;
  };
  onFilterChange: (newFilters: any) => void;
}

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({ filters, onFilterChange }) => {
  // Mock data for dropdowns - replace with actual data fetched from your backend
  const specialties = ['Cardiology', 'Neurology', 'Oncology'];
  const subspecialties = ['Interventional Cardiology', 'Neurosurgery', 'Medical Oncology'];
  const locations = ['New York', 'California', 'Texas'];
  const positions = ['Professor', 'Associate Professor', 'Assistant Professor'];

  const handleFilterSelect = (filterType: string, value: string) => {
    onFilterChange({ ...filters, [filterType]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <FilterDropdown
        label="Specialty"
        options={specialties}
        selected={filters.specialty}
        onSelect={(value) => handleFilterSelect('specialty', value)}
      />
      <FilterDropdown
        label="Subspecialty"
        options={subspecialties}
        selected={filters.subspecialty}
        onSelect={(value) => handleFilterSelect('subspecialty', value)}
      />
      <FilterDropdown
        label="Location"
        options={locations}
        selected={filters.location}
        onSelect={(value) => handleFilterSelect('location', value)}
      />
      <FilterDropdown
        label="Position"
        options={positions}
        selected={filters.position}
        onSelect={(value) => handleFilterSelect('position', value)}
      />
    </div>
  );
};

const FilterDropdown: React.FC<{
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}> = ({ label, options, selected, onSelect }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-between items-center w-48 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vibrant-teal">
        {selected || label}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Menu.Button>
      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {options.map((option) => (
            <Menu.Item key={option}>
              {({ active }) => (
                <button
                  onClick={() => onSelect(option)}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block px-4 py-2 text-sm w-full text-left`}
                >
                  {option}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default FilterDropdowns;