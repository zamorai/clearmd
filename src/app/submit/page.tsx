'use client';

import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { supabase } from '../../../lib/supabaseClient';

const validationSchema = Yup.object({
  specialty: Yup.string().required('Required'),
  subspecialty: Yup.string(),
  position: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  baseSalary: Yup.number()
    .required('Required')
    .positive('Must be a positive number'),
  rvuCompensation: Yup.number()
    .min(0, 'Must be 0 or greater'),
  bonusCompensation: Yup.number()
    .min(0, 'Must be 0 or greater'),
  partnershipStake: Yup.number()
    .min(0, 'Must be 0 or greater'),
  location: Yup.string().required('Required'),
  yearsExperience: Yup.number()
    .required('Required')
    .min(0, 'Must be 0 or greater')
    .integer('Must be a whole number'),
  institution: Yup.string(),
  workHoursPerWeek: Yup.number()
    .min(0, 'Must be 0 or greater')
    .max(168, 'Must be less than 168'),
  callDaysPerMonth: Yup.number()
    .min(0, 'Must be 0 or greater')
    .max(31, 'Must be less than 31'),
});

export default function SubmitSalaryPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { error } = await supabase.from('salaries').insert([{
        specialty: values.specialty,
        subspecialty: values.subspecialty,
        position: values.position,
        category: values.category,
        base_salary: values.baseSalary,
        rvu_compensation: values.rvuCompensation,
        bonus_compensation: values.bonusCompensation,
        partnership_stake: values.partnershipStake,
        location: values.location,
        years_experience: values.yearsExperience,
        institution: values.institution,
        work_hours_per_week: values.workHoursPerWeek,
        call_days_per_month: values.callDaysPerMonth,
        total_compensation: values.baseSalary + 
          (values.rvuCompensation || 0) + 
          (values.bonusCompensation || 0) + 
          (values.partnershipStake || 0),
      }]);

      if (error) throw error;
      setSubmitStatus('success');
      resetForm();
    } catch (error) {
      console.error('Error submitting salary:', error);
      setSubmitStatus('error');
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
            position: '',
            category: '',
            baseSalary: '',
            rvuCompensation: '',
            bonusCompensation: '',
            partnershipStake: '',
            location: '',
            yearsExperience: '',
            institution: '',
            workHoursPerWeek: '',
            callDaysPerMonth: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                 <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="">
                    <label htmlFor="specialty" className="block text-sm font-semibold leading-6 text-gray-900">
                      Specialty
                    </label>
                    <div className="mt-2.5">
                      <Field
                        type="text"
                        name="specialty"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                      {errors.specialty && touched.specialty && (
                        <div className="text-red-500 text-sm mt-1">{errors.specialty}</div>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <label htmlFor="subspecialty" className="block text-sm font-semibold leading-6 text-gray-900">
                      Subspecialty (optional)
                    </label>
                    <div className="mt-2.5">
                      <Field
                        type="text"
                        name="subspecialty"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="category" className="block text-sm font-semibold leading-6 text-gray-900">
                      Position
                    </label>
                    <div className="mt-2.5">
                      <Field
                        as="select"
                        name="category"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select a category</option>
                        <option value="academia">Academia</option>
                        <option value="hospital">Hospital</option>
                        <option value="private_practice">Private Practice</option>
                        <option value="research">Research</option>
                      </Field>
                      {errors.category && touched.category && (
                        <div className="text-red-500 text-sm mt-1">{errors.category}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="baseSalary" className="block text-sm font-semibold leading-6 text-gray-900">
                      Base Salary ($)
                    </label>
                    <div className="mt-2.5">
                      <Field
                        type="number"
                        name="baseSalary"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                      {errors.baseSalary && touched.baseSalary && (
                        <div className="text-red-500 text-sm mt-1">{errors.baseSalary}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rvuCompensation" className="block text-sm font-semibold leading-6 text-gray-900">
                      RVU Compensation ($)
                    </label>
                    <div className="mt-2.5">
                      <Field
                        type="number"
                        name="rvuCompensation"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bonusCompensation" className="block text-sm font-semibold leading-6 text-gray-900">
                      Bonus ($)
                    </label>
                    <div className="mt-2.5">
                      <Field
                        type="number"
                        name="bonusCompensation"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="partnershipStake" className="block text-sm font-semibold leading-6 text-gray-900">
                      Partnership Income ($)
                    </label>
                    <div className="mt-2.5">
                      <Field
                        type="number"
                        name="partnershipStake"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="location" className="block text-sm font-semibold leading-6 text-gray-900">
                      Location
                    </label>
                    <div className="mt-2.5">
                      <Field
                        type="text"
                        name="location"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                      {errors.location && touched.location && (
                        <div className="text-red-500 text-sm mt-1">{errors.location}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  {submitStatus === 'success' && (
                    <div className="mb-4 rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Submission Successful</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>Thank you for contributing to salary transparency in healthcare!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-4 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Submission Failed</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>Please try again later. If the problem persists, contact support.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                        ${isSubmitting 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : 'Submit Salary Information'}
                    </button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    By submitting, you agree that the information provided is accurate 
                    and can be shared anonymously on our platform.
                  </div>
                </div>
              </div>
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