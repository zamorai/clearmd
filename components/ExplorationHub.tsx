import { 
  Stethoscope, 
  Building2, 
  MapPin, 
  GraduationCap 
} from 'lucide-react';
import Link from 'next/link';

interface ExplorationCard {
  title: string;
  description: string;
  icon: any; // Using any for Lucide icons
  route: string;
  metrics: {
    primary: string;
    secondary: string;
  };
}

const ExplorationCard = ({ title, description, icon: Icon, route, metrics }: ExplorationCard) => {
  return (
    <Link 
      href={route}
      className="relative group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-x-4">
        <Icon className="h-8 w-8 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-x-4">
        <div>
          <p className="text-sm font-medium text-gray-900">{metrics.primary}</p>
          <p className="text-xs text-gray-500">{metrics.secondary}</p>
        </div>
      </div>
    </Link>
  );
};

export default function ExplorationHub() {
  const explorationPaths: ExplorationCard[] = [
    {
      title: 'By Specialty',
      description: 'Compare compensation across medical specialties and their subspecialties',
      icon: Stethoscope,
      route: '/compensation/specialty',
      metrics: {
        primary: '50+ Specialties',
        secondary: 'With subspecialty breakdowns'
      }
    },
    {
      title: 'By Practice Setting',
      description: 'Explore salaries across different practice types and positions',
      icon: Building2,
      route: '/compensation/practice',
      metrics: {
        primary: '4 Practice Types',
        secondary: 'Academic to Private Practice'
      }
    },
    {
      title: 'By Location',
      description: 'Find compensation data for different regions and cities',
      icon: MapPin,
      route: '/compensation/location',
      metrics: {
        primary: '50+ Cities',
        secondary: 'With cost of living insights'
      }
    },
    {
      title: 'By Career Stage',
      description: 'View progression from residency through senior positions',
      icon: GraduationCap,
      route: '/compensation/career',
      metrics: {
        primary: 'Career Timeline',
        secondary: 'From training to leadership'
      }
    }
  ];

  return (
    <section className="bg-gray-50 py-16 mx-8 rounded-lg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Explore Compensation Data
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find the specific information you need through multiple perspectives
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {explorationPaths.map(path => (
              <ExplorationCard key={path.title} {...path} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}