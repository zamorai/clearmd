'use client';

import { CompensationSection, ExperienceSection, OptionalSection, SpecialtySection } from '@/components/form/FormSections';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation'

const validationSchema = Yup.object().shape({
  // Specialty Section
  specialty: Yup.string()
    .uuid('Invalid specialty ID')
    .required('Specialty is required'),
  subspecialty: Yup.string()
    .uuid('Invalid subspecialty ID')
    .nullable(),
  jobFamily: Yup.string()
    .uuid('Invalid job family ID')
    .required('Job family is required'),
  position: Yup.string()
    .uuid('Invalid position ID')
    .required('Position is required'),

  // Experience Section
  yearsInPosition: Yup.number()
    .required('Years in position is required')
    .min(0, 'Must be 0 or greater')
    .integer('Must be a whole number')
    .max(100, 'Please enter a realistic value'),
  yearsExperience: Yup.number()
    .required('Total years of experience is required')
    .min(0, 'Must be 0 or greater')
    .integer('Must be a whole number')
    .max(100, 'Please enter a realistic value')
    .test('more-than-position', 'Cannot be less than years in position', 
      function(value) {
        return !value || !this.parent.yearsInPosition || 
          value >= this.parent.yearsInPosition;
    }),
  location: Yup.object().shape({
    display: Yup.string()
      .required('Location is required'),
    city: Yup.string()
      .required('Please select a valid city from the suggestions'),
    state: Yup.string()
      .required('State is required'),
    country: Yup.string()
      .required('Country is required')
  }).required('Location is required'),

  // Compensation Section
  baseSalary: Yup.number()
    .required('Base salary is required')
    .positive('Must be a positive number'),
  salaryType: Yup.string()
    .oneOf(['annually', 'hourly'], 'Invalid salary type')
    .required('Salary type is required'),
  bonusCompensation: Yup.number()
    .nullable()
    .min(0, 'Must be 0 or greater'),

  // Optional Section
  gender: Yup.string()
    .oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Invalid gender selection')
    .nullable(),
});

export default function SubmitSalaryPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentSection, setCurrentSection] = useState(1);
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      const { data: existingLocation } = await supabase
        .from('locations')
        .select('id')
        .match({
          city: values.location.city,
          state: values.location.state,
          country: values.location.country
        })
        .single();

      let locationId;

      if (existingLocation) {
        locationId = existingLocation.id;
      } else {
        const { data: newLocation, error: locationError } = await supabase
          .from('locations')
          .insert({
            city: values.location.city,
            state: values.location.state,
            country: values.location.country
          })
          .select()
          .single();

        if (locationError) throw locationError;
        locationId = newLocation.id;
      }
  
      // Then insert salary data
      const { error: salaryError } = await supabase
        .from('salaries')
        .insert({
          specialty_id: values.specialty,
          subspecialty_id: values.subspecialty || null,
          location_id: locationId,
          position_id: values.position,
          category_id: values.jobFamily,
          base_salary: Number(values.baseSalary),
          bonus: values.bonusCompensation ? Number(values.bonusCompensation) : null,
          years_experience: Number(values.yearsExperience),
          gender: values.gender || null
        });
  
      if (salaryError) throw salaryError;
      
      setSubmitStatus('success');
      router.push('/');
    } catch (error) {
      console.error('Error submitting salary:', error);
      setSubmitStatus('error');
    }
  };

  const isSpecialtyComplete = values => {
    
    if (
    values.specialty && 
    values.jobFamily && 
    values.position ) {
      setCurrentSection(2)
      return true;
    }
    return false;
  };

  const isExperienceComplete = values => {
    if (
    values.yearsInPosition &&
    values.yearsExperience &&
    values.location.display
  ) {
    setCurrentSection(3)
    return true;
  }
};

  const isCompensationComplete = values => {
    if (
    values.baseSalary &&
    values.salaryType
  ) {
    setCurrentSection(4)
    return true;
  }
    };

  return (
<div className="relative isolate bg-white">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    {/* Floating container with rounded corners */}
    <div className="mt-16 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        {/* Left column */}
        <div className="relative lg:rounded-l-2xl overflow-hidden">
          {/* Pattern background - Now properly constrained */}
          <div className="absolute inset-0 bg-gray-50">
            <svg
              className="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                  width={200}
                  height={200}
                  x="100%"
                  y={-1}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M130 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" strokeWidth={0} fill="white" />
              <svg x="100%" y={-1} className="overflow-visible fill-gray-50">
                <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
              </svg>
              <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
            </svg>
          </div>
          
          {/* Left column content */}
          <div className="relative px-6 pb-20 pt-24 sm:pt-24 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Share your salary
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Your contribution matters more than you know. By sharing your compensation details, 
                you're helping fellow medical professionals make informed career decisions and 
                fostering a culture of transparency in healthcare.
              </p>
              <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Privacy</span>
                    <ShieldCheckIcon className="h-7 w-6 text-blue-600" />
                  </dt>
                  <dd>Private and Secure submissions</dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Community</span>
                    <UserGroupIcon className="h-7 w-6 text-blue-600" />
                  </dt>
                  <dd>Help break salary secrecy</dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Impact</span>
                    <BuildingOffice2Icon className="h-7 w-6 text-blue-600" />
                  </dt>
                  <dd>Shape the future of medical compensations</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="relative px-6 pb-24 pt-20 sm:pb-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
          <Formik
            initialValues={{
              specialty: '',
              subspecialty: '',
              jobFamily: '',
              position: '',
              yearsInPosition: '',
              yearsExperience: '',
              location: {
                display: '',
                city: '',
                state: '',
                country: ''
              },
              baseSalary: '',
              salaryType: '',
              bonusCompensation: '',
              gender: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, isValid }) => (
              <Form className="space-y-8">
                <SpecialtySection 
                  isVisible={currentSection >= 1}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
                {isSpecialtyComplete(values) && (
                  <ExperienceSection 
                    isVisible={currentSection >= 2}
                    errors={errors}
                    touched={touched}
                  />
                )}
                
                {isExperienceComplete(values) && (
                  <CompensationSection 
                    isVisible={currentSection >= 3}
                    values={values}
                  />
                )}
                
                {isCompensationComplete(values) && (
                  <OptionalSection 
                    isVisible={currentSection >= 4}
                  />
                )}

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`w-full rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm
                    ${!isValid || isSubmitting
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Salary Information'}
                </button>
              </Form>
            )}
          </Formik>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}