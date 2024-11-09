import { useState } from "react";
import { usePositionData, useSpecialtyData, useSubspecialtyData } from "../../hooks/useSpecialtyData";
import { ComboboxField } from "./ComboboxField";
import { CompensationPill } from "./CompensationPill";
import { CurrencyField } from "./CurrencyField";
import { LocationField } from "./LocationField";
import { NumberField } from "./NumberField";
import { SelectField } from "./SelectField";

export const SpecialtySection = ({ isVisible, values, errors, touched }) => {
  const { specialties, loading: specialtiesLoading } = useSpecialtyData();
  const { subspecialties, loading: subspecialtiesLoading } = useSubspecialtyData(values.specialty);
  const { positions, categories, loading: positionsLoading } = usePositionData(values.jobFamily);
  console.log(errors)

  return (
    <div className={`space-y-4 ${isVisible ? '' : 'hidden'}`}>
      <h3 className="text-base font-medium text-gray-700 mb-4">
        Medical Specialty & Position
      </h3>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <ComboboxField
          name="specialty"
          label="Specialty"
          options={specialties.map(s => ({
            value: s.id,
            label: s.name
          }))}
          errors={errors}
          touched={touched}
          fullWidth
          loading={specialtiesLoading}
        />
        <ComboboxField
          name="subspecialty"
          label="Subspecialty (optional)"
          options={subspecialties.map(s => ({
            value: s.id,
            label: s.name
          }))}
          fullWidth
          loading={subspecialtiesLoading}
          disabled={!values.specialty}
        />
        <ComboboxField
          name="jobFamily"
          label="Job Family"
          options={categories.map(c => ({
            value: c.id,
            label: c.display_name
          }))}
          errors={errors}
          touched={touched}
          loading={positionsLoading}
        />
        <ComboboxField
          name="position"
          label="Position"
          options={positions.map(p => ({
            value: p.id,
            label: p.title
          }))}
          errors={errors}
          touched={touched}
          loading={positionsLoading}
          disabled={!values.jobFamily}
        />
      </div>
    </div>
  );
};

export const ExperienceSection = ({ isVisible, errors, touched }) => (
  <div className={`space-y-4 ${isVisible ? '' : 'hidden'}`}>
    <h3 className="text-base font-medium text-gray-700 mb-4">Work Experience & Location</h3>
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <NumberField
        name="yearsInPosition"
        label="Years in Current Position"
        errors={errors}
        touched={touched}
      />
      <NumberField
        name="yearsExperience"
        label="Total Years of Experience"
        errors={errors}
        touched={touched}
      />
       <LocationField
        name="location"
        label="Location"
      />
    </div>
  </div>
);

export const CompensationSection = ({ isVisible, values, setFieldValue }) => {
  const [showBonus, setShowBonus] = useState(false);

  return (
    <div className={`space-y-4 ${isVisible ? '' : 'hidden'}`}>
      <h3 className="text-base font-medium text-gray-700 mb-4">Compensation Details</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-x-4">
          <div className="col-span-3">
            <CurrencyField
              name="baseSalary"
              label="Base Salary"
            />
          </div>
          <div className="col-span-2">
            <SelectField
              name="salaryType"
              label="Type"
              options={[
                { value: 'annually', label: 'Annually' },
                { value: 'hourly', label: 'Hourly' }
              ]}
            />
          </div>
        </div>
        
        {showBonus && (
          <CurrencyField
            name="bonusCompensation"
            label="Bonus Amount"
          />
        )}

        <div className="flex gap-2">
          <CompensationPill
            label="Bonus"
            active={showBonus}
            onClick={() => setShowBonus(!showBonus)}
          />
        </div>
      </div>
    </div>
  );
};
export const OptionalSection = ({ isVisible }) => (
  <div className={`space-y-4 ${isVisible ? '' : 'hidden'}`}>
    <h3 className="text-base font-medium text-gray-700 mb-4">Optional Information</h3>
    <SelectField
      name="gender"
      label="Gender"
      options={[
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]}
    />
  </div>
);