'use client'

import { useState, useEffect } from 'react';
import MainHeroSection from '@/components/MainHeroSection';
import SalaryComparison from '@/components/SalaryComparison';
import CallToAction from '@/components/CallToAction';

export default function HomePage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedSubspecialty, setSelectedSubspecialty] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-soft-gray">
      <MainHeroSection selectedSpecialty={selectedSpecialty} setSelectedSpecialty={setSelectedSpecialty} selectedSubspecialty={selectedSubspecialty} setSelectedSubspecialty={setSelectedSubspecialty} />
      <SalaryComparison
        selectedSpecialty={selectedSpecialty}
        selectedSubspecialty={selectedSubspecialty}
      />
      <CallToAction />
    </div>
  );
}