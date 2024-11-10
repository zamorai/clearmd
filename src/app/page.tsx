'use client'

import { useState } from 'react';
import MainHeroSection from '@/components/MainHeroSection';
import SalaryComparison from '@/components/SalaryComparison';
import CallToAction from '@/components/CallToAction';
import ExplorationHub from '@/components/ExplorationHub';

export default function HomePage() {
  // Default to anesthesiology
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null || 'd77299b2-b099-48b3-b1c8-6012b8905406');
  const [selectedSubspecialty, setSelectedSubspecialty] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative">
      <MainHeroSection selectedSpecialty={selectedSpecialty} setSelectedSpecialty={setSelectedSpecialty} selectedSubspecialty={selectedSubspecialty} setSelectedSubspecialty={setSelectedSubspecialty} />
      <SalaryComparison
        selectedSpecialty={selectedSpecialty}
        selectedSubspecialty={selectedSubspecialty}
      />
      <ExplorationHub />
      <CallToAction />
    </div>
  );
}