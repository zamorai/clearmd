import React from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSpecialtyData, useSubspecialtyData } from '../hooks/useSpecialtyData';

interface SpecialtySelectorProps {
  selectedSpecialty: string | null;
  selectedSubspecialty: string | null;
  onSpecialtyChange: (specialtyId: string) => void;
  onSubspecialtyChange: (subspecialtyId: string | null) => void;
  className?: string;
}

export default function SpecialtySelector({
  selectedSpecialty,
  selectedSubspecialty,
  onSpecialtyChange,
  onSubspecialtyChange,
  className = ''
}: SpecialtySelectorProps) {
  const { specialties, loading: specialtiesLoading } = useSpecialtyData();
  const { subspecialties, loading: subspecialtiesLoading } = useSubspecialtyData(selectedSpecialty);
  
  const selectedSpecialtyName = specialties.find(s => s.id === selectedSpecialty)?.name;
  const selectedSubspecialtyName = subspecialties.find(s => s.id === selectedSubspecialty)?.name;

  console.log(selectedSpecialtyName, selectedSpecialty)

  const handleSpecialtyChange = (specialtyId: string) => {
    onSpecialtyChange(specialtyId);
    onSubspecialtyChange(null); // Reset subspecialty when specialty changes
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      <Menu as="div" className="relative">
        <Menu.Button className="inline-flex justify-between items-center w-64 rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          {specialtiesLoading ? 'Loading...' : selectedSpecialtyName || 'Select Specialty'}
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Menu.Items className="absolute z-10 mt-2 w-64 max-h-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto">
          {specialties.map((specialty) => (
            <Menu.Item key={specialty.id}>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } w-full text-left px-4 py-2 text-sm text-gray-900`}
                  onClick={() => handleSpecialtyChange(specialty.id)}
                >
                  {specialty.name}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>

      <Menu as="div" className="relative">
        <Menu.Button 
          disabled={!selectedSpecialty}
          className={`inline-flex justify-between items-center w-64 rounded-lg border shadow-sm px-4 py-2 text-sm font-medium
            ${!selectedSpecialty 
              ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
        >
          {subspecialtiesLoading 
            ? 'Loading...' 
            : selectedSubspecialtyName || 'Subspecialty'}
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </Menu.Button>
        {selectedSpecialty && (
          <Menu.Items className="absolute z-10 mt-2 w-64 max-h-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } w-full text-left px-4 py-2 text-sm text-gray-900`}
                  onClick={() => onSubspecialtyChange(null)}
                >
                  None
                </button>
              )}
            </Menu.Item>
            {subspecialties.map((subspecialty) => (
              <Menu.Item key={subspecialty.id}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2 text-sm text-gray-900`}
                    onClick={() => onSubspecialtyChange(subspecialty.id)}
                  >
                    {subspecialty.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        )}
      </Menu>
    </div>
  );
}