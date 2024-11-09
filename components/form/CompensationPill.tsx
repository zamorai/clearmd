export const CompensationPill = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium 
      ${active 
        ? 'bg-blue-100 text-blue-700' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } transition-colors duration-200`}
  >
    {active ? '✓' : '+'} {label}
  </button>
);