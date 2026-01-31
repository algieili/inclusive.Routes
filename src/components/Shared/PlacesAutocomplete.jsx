import React, { useEffect, useRef } from 'react';

export default function PlacesAutocomplete({ onPlaceSelected, placeholder = "Search destination..." }) {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (!inputRef.current || !window.google?.maps?.places) return;

        // Initialize autocomplete restricted to Philippines
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'ph' }, // Philippines only
            fields: ['name', 'geometry', 'formatted_address', 'place_id'],
            types: ['establishment', 'geocode'] // All types of places
        });

        autocompleteRef.current = autocomplete;

        // Listen for place selection
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                console.error('No location data');
                return;
            }

            // Call parent callback with place data
            onPlaceSelected({
                name: place.name,
                address: place.formatted_address,
                location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },
                placeId: place.place_id
            });
        });

        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, [onPlaceSelected]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="w-full bg-slate-100 p-4 pl-12 rounded-2xl text-lg font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
        />
    );
}
