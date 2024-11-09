'use client'

import React, { useState } from 'react';
import SpecialtySelector from './SpecialtySelector';
import { useSpecialtyStats } from '../hooks/useStatistics';
import { Users, TrendingUp, MapPin, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

// Custom Y-Axis tick formatter
const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const MainHeroSection = ({selectedSpecialty, setSelectedSpecialty, selectedSubspecialty, setSelectedSubspecialty}) => {
  
  const { stats, loading } = useSpecialtyStats(selectedSpecialty);

  useEffect(() => {

  }, [selectedSpecialty, selectedSubspecialty])

  console.log(stats)

  return (
    <div className="relative isolate overflow-hidden bg-white py-24">
      <div className=''>
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
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Medical Compensation Transparency
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Compare salaries across specialties and locations to make informed career decisions
            </p>
          </div>

          <div className="mt-10">
            <SpecialtySelector
              selectedSpecialty={selectedSpecialty}
              selectedSubspecialty={selectedSubspecialty}
              onSpecialtyChange={setSelectedSpecialty}
              onSubspecialtyChange={setSelectedSubspecialty}
              className="justify-center items-center flex-col md:flex-row"
            />
          </div>

          {/* Stats Grid */}
           {/* Stats Grid */}
           <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="wait">
            {stats && (
              <>
              <motion.div
                key={`salary-${stats?.specialty_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Average Salary</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {formatCurrency(stats?.stats?.overview.avg_total_comp)}
                </dd>
              </motion.div>

              <motion.div
                key={`location-${stats?.specialty_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Weekly Hours</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stats?.stats?.overview.avg_hours_worked}
                </dd>
              </motion.div>

              <motion.div
                key={`subspecialty-${stats?.specialty_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Years of Experience</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stats?.stats?.overview.avg_years_experience}
                </dd>
              </motion.div>

              <motion.div
                key={`datapoints-${stats?.specialty_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col bg-gray-400/5 p-8"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600">Data Points</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stats?.stats?.overview.total_entries}
                </dd>
              </motion.div>
              </>
            )}
            </AnimatePresence>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default MainHeroSection