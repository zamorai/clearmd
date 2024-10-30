// src/components/MainHeroSection.tsx
import React from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface MainHeroSectionProps {
  specialties: string[];
  subspecialties: string[];
  selectedSpecialty: string;
  selectedSubspecialty: string;
  onSpecialtyChange: (specialty: string) => void;
  onSubspecialtyChange: (subspecialty: string) => void;
  stats: {
    averageSalary: string;
    topLocation: string;
    popularSubspecialty: string;
    dataPoints: string;
  };
}

const MainHeroSection: React.FC<MainHeroSectionProps> = ({
  specialties,
  subspecialties,
  selectedSpecialty,
  selectedSubspecialty,
  onSpecialtyChange,
  onSubspecialtyChange,
  stats,
}) => {
  const handleSpecialtyChange = (specialty: string) => {
    onSpecialtyChange(specialty);
    // Reset subspecialty when specialty changes
    onSubspecialtyChange('');
  };

  return (
    <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Transparent medical compensations
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              No more salary uncertainty
            </p>
          </div>

          {/* Specialty Filters */}
          <div className="mt-8 flex justify-center gap-4">
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex w-48 justify-between items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50">
                {selectedSpecialty || 'Select Specialty'}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Menu.Items className="absolute z-10 mt-2 w-48 h-72 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {specialties.map((specialty) => (
                    <Menu.Item key={specialty}>
                      {({ active }) => (
                        <button
                          onClick={() => handleSpecialtyChange(specialty)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                        >
                          {specialty}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>

            <Menu as="div" className="relative">
              <Menu.Button 
                className={`inline-flex w-48 justify-between items-center rounded-md bg-white px-4 py-2 text-sm font-medium border border-gray-300 
                  ${selectedSpecialty ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'}`}
                disabled={!selectedSpecialty}
              >
                {selectedSubspecialty || 'Select Subspecialty'}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Menu.Items className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {subspecialties.map((subspecialty) => (
                    <Menu.Item key={subspecialty}>
                      {({ active }) => (
                        <button
                          onClick={() => onSubspecialtyChange(subspecialty)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                        >
                          {subspecialty}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>
          </div>

          {/* Stats Grid */}
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`salary-${stats.averageSalary}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Average Salary</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stats.averageSalary}
                </dd>
              </motion.div>

              <motion.div
                key={`location-${stats.topLocation}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Weekly Hours</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stats.topLocation}
                </dd>
              </motion.div>

              <motion.div
                key={`subspecialty-${stats.popularSubspecialty}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Comparative salary</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stats.popularSubspecialty}
                </dd>
              </motion.div>

              <motion.div
                key={`datapoints-${stats.dataPoints}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Data Points</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stats.dataPoints}
                </dd>
              </motion.div>
            </AnimatePresence>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MainHeroSection