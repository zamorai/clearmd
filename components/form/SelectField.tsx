import { Field } from 'formik';


export const SelectField = ({ name, label, options = [] }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-normal text-gray-500 mb-1">
      {label}
    </label>
    <div className="mt-2">
      <Field
        as="select"
        name={name}
        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
    </div>
  </div>
);