import React from 'react';

interface SummarySectionProps {
  data: {
    average_total_comp: number;
    average_years_experience: number;
    most_common_location: string;
  } | null;
}

const SummarySection: React.FC<SummarySectionProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Average Total Compensation</p>
          <p className="text-2xl font-bold">${data.average_total_comp.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Average Years of Experience</p>
          <p className="text-2xl font-bold">{data.average_years_experience.toFixed(1)} years</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Most Common Location</p>
          <p className="text-2xl font-bold">{data.most_common_location}</p>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;