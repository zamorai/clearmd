import { Fragment, useState } from 'react';
import { Field, useField } from 'formik';
import { 
  Combobox, 
  ComboboxButton, 
  ComboboxInput, 
  ComboboxOption, 
  ComboboxOptions,
  Transition 
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export const ComboboxField = ({ 
  name, 
  label, 
  options = [], 
  errors = {}, 
  touched = {}, 
  fullWidth = false,
  loading = false,
  disabled = false
}) => {
  const [query, setQuery] = useState('');
  const [userIsTyping, setUserIsTyping] = useState(false);

  const filteredOptions = query === ''
    ? options
    : options.filter((option) => 
        option.label.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Field name={name}>
      {({ field, form }) => {
        const selectedOption = options.find(opt => opt.value === field.value);

        return (
          <div className={`${fullWidth ? 'col-span-2' : ''}`}>
            <label className="block text-sm font-normal text-gray-500 mb-1">
              {label}
            </label>
            <Combobox
              as="div"
              value={field.value}
              onChange={(value) => {
                form.setFieldValue(name, value);
                setUserIsTyping(false); // Reset typing state when selection is made
              }}
              onBlur={() => {
                form.setFieldTouched(name, true);
                setUserIsTyping(false); // Reset typing state on blur
              }}
              disabled={disabled}
            >
              <div className="relative">
                <ComboboxInput
                  autoComplete="off"
                  className={clsx(
                    "block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6",
                    disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
                    loading && "pr-10" // Make room for loading spinner
                  )}
                  onBlur={() => {
                    if (!options.find(opt => opt.value === field.value)) {
                      form.setFieldValue(name, '');
                      setQuery('');
                    }
                    form.setFieldTouched(name, true);
                  }}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setUserIsTyping(true);
                  }}
                  displayValue={(value) => {
                    if (userIsTyping) return query;
                    return selectedOption?.label || '';
                  }}
                  disabled={disabled}
                />
                
                {loading ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg 
                      className="animate-spin h-5 w-5 text-gray-400" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                ) : (
                  <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className={clsx(
                        "h-5 w-5 text-gray-400",
                        !disabled && "hover:text-gray-500"
                      )}
                      aria-hidden="true"
                    />
                  </ComboboxButton>
                )}

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <ComboboxOptions className={clsx(
                    'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-2',
                    'text-base shadow-lg ring-1 ring-black/5 focus:outline-none'
                  )}>
                    {loading ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Loading...
                      </div>
                    ) : filteredOptions.length === 0 ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredOptions.map((option) => (
                        <CustomComboBoxOption
                          key={option.value}
                          option={option}
                        />
                      ))
                    )}
                  </ComboboxOptions>
                </Transition>
              </div>
            </Combobox>
            {errors[name] && touched[name] && (
              <div className="text-red-500 text-xs mt-1">{errors[name]}</div>
            )}
          </div>
        );
      }}
    </Field>
  );
};

const CustomComboBoxOption = ({ option }) => (
  <Combobox.Option
    value={option.value}
    className={({ active, selected }) =>
      clsx(
        'relative flex items-center py-2 mx-1 px-2 text-sm text-gray-900 cursor-default select-none',
        'group',
        active && 'bg-gray-50/75 rounded-md',
        selected && 'font-medium'
      )}
  >
    {({ active, selected }) => (
      <>
        <span className="flex items-center gap-2">
          {selected && (
            <CheckIcon 
              className="h-4 w-4 text-blue-600 flex-shrink-0" 
              aria-hidden="true" 
            />
          )}
          {!selected && <span className="w-4" />}
          <span className={clsx(
            'block truncate',
            selected ? 'font-medium' : 'font-normal'
          )}>
            {option.label}
          </span>
        </span>
      </>
    )}
  </Combobox.Option>
);