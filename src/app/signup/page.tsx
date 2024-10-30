// app/signup/page.tsx

'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function SignUpPage() {
  const router = useRouter();

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string()
      .required('Required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    full_name: Yup.string(),
  });

  const handleSignUp = async (values, { setSubmitting, setErrors }) => {
    const { email, password, full_name } = values;

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    setSubmitting(false);

    if (error) {
      console.error('Error signing up:', error);
      setErrors({ submit: error.message });
    } else {
      alert('Sign-up successful! Please check your email to confirm your account.');
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSignUp}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name (Optional)
              </label>
              <Field
                id="full_name"
                name="full_name"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <div>
              {errors.submit && <div className="text-red-500 text-sm">{errors.submit}</div>}
              <button
                type="submit"
                className="w-full rounded-md bg-primary py-2 text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
