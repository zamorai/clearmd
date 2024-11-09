
import { Field } from 'formik';

export const CurrencyField = ({ name, label }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-normal text-gray-500 mb-1">
      {label}
    </label>
    <div className="mt-2 relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 sm:text-sm">$</span>
      </div>
      <Field
        type="number"
        name={name}
        className="block w-full rounded-md border-0 py-2 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        placeholder="0.00"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <span className="text-gray-500 sm:text-sm">USD</span>
      </div>
    </div>
  </div>
);