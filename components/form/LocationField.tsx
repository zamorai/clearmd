import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useField } from 'formik';
import { useRef } from 'react';

const libraries = ['places'];

export const LocationField = ({ name, label }) => {
  const [field, meta, helpers] = useField(name);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: libraries as any,
  });

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.address_components) return;

    let city = '', state = '', country = '';
    
    place.address_components.forEach((component) => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
      if (component.types.includes('country')) {
        country = component.short_name;
      }
    });

    // Update input value with formatted address
    if (inputRef.current) {
      inputRef.current.value = place.formatted_address || '';
    }

    // Store structured location data
    helpers.setValue({
      display: place.formatted_address,
      city,
      state,
      country
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='col-span-2'>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
          autocomplete.setFields(['address_components', 'formatted_address']);
        }}
        onPlaceChanged={handlePlaceSelect}
        options={{
          types: ['(cities)'],
          componentRestrictions: { country: 'us' }
        }}
      >
        <input
          ref={inputRef}
          id="location-input"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          defaultValue={field.value?.display || ''}
          placeholder="Start typing a city..."
        />
      </Autocomplete>
      {meta.touched && meta.error && (
        <div className="mt-1 text-sm text-red-600">
          {typeof meta.error === 'string' ? meta.error : 'Please select a valid location'}
        </div>
      )}
    </div>
  );
};