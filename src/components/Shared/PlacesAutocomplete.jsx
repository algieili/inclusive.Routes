import React, { useState, useEffect, useRef } from 'react';
import { searchPlaces } from '../../utils/mapUtils';
import { MapPin, Search, Star, Clock } from 'lucide-react';

export default function PlacesAutocomplete({ onPlaceSelected, favorites = [], placeholder = "Search destination..." }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                const results = await searchPlaces(query, import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
                setSuggestions(results);
                setIsOpen(true);
            } else if (query.length === 0) {
                setSuggestions([]);
                // Keep open if focused to show favorites
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (place) => {
        setQuery(place.text || place.name);
        setIsOpen(false);
        onPlaceSelected({
            name: place.text || place.name,
            address: place.place_name || place.location,
            location: place.center ? {
                lat: place.center[1], // Mapbox returns [lng, lat]
                lng: place.center[0]
            } : place.coordinates,
            placeId: place.id || place.name
        });
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
                <input
                    type="text"
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/90 backdrop-blur-md p-5 pl-14 rounded-[2rem] text-lg font-bold text-slate-800 outline-none shadow-xl border-2 border-transparent focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 z-[100] mt-3 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Show Suggestions if typing */}
                    {query.length > 0 ? (
                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                            {suggestions.map((place) => (
                                <button
                                    key={place.id}
                                    onClick={() => handleSelect(place)}
                                    className="w-full text-left p-5 hover:bg-slate-50 flex items-start space-x-4 border-b border-slate-50 last:border-0 transition-colors group"
                                >
                                    <div className="mt-1 bg-blue-50 p-3 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <MapPin size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-800 text-base">{place.text}</h4>
                                        <p className="text-xs font-bold text-slate-400 truncate max-w-[200px] mt-0.5">{place.place_name}</p>
                                    </div>
                                </button>
                            ))}
                            {suggestions.length === 0 && query.length > 2 && (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Search size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 font-bold text-sm">Searching for "{query}"...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Show Favorites if query is empty */
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
                                <span className="text-[0.65rem] font-black text-blue-600 uppercase tracking-[0.2em] italic">Recent Favorites</span>
                                <Star size={14} className="text-blue-400 fill-blue-400" />
                            </div>
                            {favorites.map((fav, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(fav)}
                                    className="w-full text-left p-5 hover:bg-blue-50/50 flex items-center space-x-4 border-b border-slate-50 last:border-0 transition-all group"
                                >
                                    <div className="p-3 rounded-2xl bg-orange-100 text-orange-600 group-hover:scale-110 transition-transform shadow-sm">
                                        <Clock size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-800 text-base">{fav.name}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{fav.location}</p>
                                    </div>
                                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Star size={18} fill="currentColor" />
                                    </div>
                                </button>
                            ))}
                            {favorites.length === 0 && (
                                <div className="p-10 text-center">
                                    <p className="text-slate-400 font-bold text-sm italic">Search to add favorites</p>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                        <span className="text-[0.55rem] font-black text-slate-400 uppercase tracking-[0.3em]">Mapbox Satellite Data Active</span>
                    </div>
                </div>
            )}
        </div>
    );
}
