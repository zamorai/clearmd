// 1. Update types/interfaces (create new file: types/medical.ts)
export interface EmploymentCategory {
  id: string;
  name: string;
  display_name: string;
  description: string;
}

export interface Specialty {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  avg_years_education: number;
}

export interface Subspecialty {
  id: string;
  specialty_id: string;
  name: string;
}

export interface Position {
  id: string;
  category_id: string;
  level_id: string;
  title: string;
}

export interface PositionLevel {
  id: string;
  name: string;
  rank_order: number;
}
