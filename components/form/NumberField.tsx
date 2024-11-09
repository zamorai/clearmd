
import { Field } from 'formik';
import clsx from 'clsx'

export const NumberField = ({ name, label, errors, touched }) => (
  <div>
    <label className="block text-sm font-normal text-gray-500 mb-1">
      {label}
    </label>
    <div className="mt-1">
      <Field
        type="text"
        inputMode="numeric"
        autoComplete="off"
        pattern="[0-9]*"
        name={name}
        className="block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      />
      {errors[name] && touched[name] && (
        <div className="text-red-500 text-xs mt-1">{errors[name]}</div>
      )}
    </div>
  </div>
);