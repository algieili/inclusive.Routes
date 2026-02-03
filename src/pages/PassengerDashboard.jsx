import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Compass, Star, Clock, Heart, User, Home, Search, ChevronRight, Settings, LogOut, ShieldCheck, Sun, Moon, Eye, Volume2, ArrowLeft, Activity } from 'lucide-react';
import { calculateFare } from '../utils/fareCalculator';
import RouteMap from '../components/Shared/RouteMap';
import { useRoute } from '../context/RouteContext';
import { useAuth } from '../context/AuthContext';
import { getDistanceKm, reverseGeocode } from '../utils/mapUtils';
import PlacesAutocomplete from '../components/Shared/PlacesAutocomplete';

export default function PassengerDashboard() {
    const navigate = useNavigate();
    const { user, logout, accessibility, updateAccessibility } = useAuth();
    const { setRoute, favorites, removeFavorite } = useRoute();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentAddress, setCurrentAddress] = useState('');
    const [activeTab, setActiveTab] = useState('map');
    const [profileView, setProfileView] = useState('main');

    const toggleSetting = (key) => {
        if (updateAccessibility) updateAccessibility({ [key]: !accessibility[key] });
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setCurrentLocation(pos);
                    try {
                        const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
                        const address = await reverseGeocode(pos.lng, pos.lat, token);
                        if (address) {
                            setCurrentAddress(address.split(',')[0].toUpperCase());
                        }
                    } catch (e) {
                        console.error('Geocoding error:', e);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setCurrentLocation({ lat: 14.3553, lng: 121.0644 });
                    setCurrentAddress('SAN PEDRO, LAGUNA');
                }
            );
        }
    }, []);

    const popularDestinations = [
        { name: "Crossing", location: "Coolbase iCity", coordinates: { lat: 14.3720, lng: 121.0950 } },
        { name: "Pulo", location: "Coolbase Area", coordinates: { lat: 14.3650, lng: 121.0800 } },
        { name: "Market Area", location: "Midas iCity", coordinates: { lat: 14.3800, lng: 121.1100 } }
    ];

    const handlePlaceSelected = (place) => {
        if (!currentLocation) {
            alert('Enabling GPS... Please try again.');
            return;
        }

        const distanceKmVal = getDistanceKm(currentLocation.lat, currentLocation.lng, place.location.lat, place.location.lng);
        const distanceKm = distanceKmVal.toFixed(1);
        const fare = calculateFare(parseFloat(distanceKm));

        setRoute({
            origin: currentLocation,
            destination: place.name,
            destinationLocation: place.location,
            distance: `${distanceKm} Km`,
            totalTime: `${Math.round(parseFloat(distanceKm) * 3)} min`,
            transportOption: { type: 'Jeepney', price: `₱${fare.netFare}` },
            useRealDirections: true
        });
        navigate('/navigate');
    };

    const NavButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => { setActiveTab(id); if (id === 'profile') setProfileView('main'); }}
            className={`flex flex-col items-center space-y-2 transition-all active:scale-90 ${activeTab === id ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
        >
            <div className={`p-3 rounded-2xl transition-all ${activeTab === id ? 'bg-blue-50 text-blue-600 shadow-inner' : ''}`}>
                <Icon size={26} strokeWidth={activeTab === id ? 4 : 2} />
            </div>
            <span className={`text-[0.6rem] font-black uppercase tracking-[0.2em] ${accessibility.largeText ? 'text-[0.7rem]' : ''} ${activeTab === id ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
        </button>
    );

    const renderFavorites = () => (
        <div className={`absolute inset-x-0 top-0 bottom-24 z-[60] p-6 pt-24 overflow-y-auto ${accessibility.highContrast ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
            <h2 className="text-3xl font-black mb-8 uppercase italic">Saved Places</h2>
            <div className="space-y-4">
                {favorites && favorites.map((fav, index) => (
                    <button
                        key={index}
                        onClick={() => handlePlaceSelected({ name: fav.name, location: { lat: fav.coordinates[1], lng: fav.coordinates[0] }, address: fav.location })}
                        className={`w-full p-6 border rounded-[2rem] flex items-center justify-between group ${accessibility.highContrast ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-blue-50'}`}
                    >
                        <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
                                <Star className="text-blue-600 fill-blue-600" size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-black text-lg italic uppercase">{fav.name}</h3>
                                <p className="text-slate-400 text-[0.6rem] font-black uppercase">{fav.location}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300" />
                    </button>
                ))}
            </div>
        </div>
    );

    const renderProfile = () => {
        if (profileView === 'accessibility') {
            return (
                <div className="absolute inset-x-0 top-0 bottom-24 z-[60] bg-[#0B1221] p-6 pt-12 overflow-y-auto animate-in slide-in-from-right-10 duration-500 text-left">
                    <button onClick={() => setProfileView('main')} className="flex items-center space-x-2 text-blue-400 mb-8 font-black uppercase text-[0.7rem] hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Profile</span>
                    </button>

                    <h2 className="text-4xl font-black mb-8 italic tracking-tighter text-white uppercase italic">System Settings</h2>

                    <div className="space-y-6">
                        <button onClick={() => toggleSetting('highContrast')} className={`w-full flex items-center justify-between p-7 rounded-[2rem] border-2 transition-all ${accessibility.highContrast ? 'bg-blue-600 border-blue-400 text-white' : 'bg-[#151D2E]/80 border-white/5 text-slate-300'}`}>
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-black/20 rounded-2xl">
                                    {accessibility.highContrast ? <Sun size={28} /> : <Moon size={28} />}
                                </div>
                                <span className="font-extrabold text-xl italic uppercase tracking-tight">High Contrast</span>
                            </div>
                            <div className={`w-16 h-9 rounded-full p-1.5 transition-colors ${accessibility.highContrast ? 'bg-white/40' : 'bg-slate-700'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full transition-transform shadow-xl ${accessibility.highContrast ? 'translate-x-[1.75rem]' : 'translate-x-0'}`}></div>
                            </div>
                        </button>

                        <button onClick={() => toggleSetting('largeText')} className={`w-full flex items-center justify-between p-7 rounded-[2rem] border-2 transition-all ${accessibility.largeText ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-[#151D2E]/80 border-white/5 text-slate-300'}`}>
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-black/20 rounded-2xl">
                                    <Eye size={28} />
                                </div>
                                <span className="font-extrabold text-xl italic uppercase tracking-tight">Large Text</span>
                            </div>
                            <div className={`w-16 h-9 rounded-full p-1.5 transition-colors ${accessibility.largeText ? 'bg-white/40' : 'bg-slate-700'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full transition-transform shadow-xl ${accessibility.largeText ? 'translate-x-[1.75rem]' : 'translate-x-0'}`}></div>
                            </div>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="absolute inset-x-0 top-0 bottom-24 z-[60] bg-[#0B1221] p-6 pt-12 overflow-y-auto animate-in fade-in duration-500 text-center flex flex-col">
                {/* Futuristic Header */}
                <div className="flex items-center justify-between mb-12 px-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-[1.2rem] flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <MapPin className="text-red-500" size={28} fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white italic">
                            INCLUSIVE <span className="text-slate-400">ROUTE</span>
                        </h1>
                    </div>
                    <div className="w-12 h-12 bg-[#151D2E] border border-white/10 rounded-[1.2rem] flex items-center justify-center text-slate-400">
                        <Settings size={22} />
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="relative mx-auto mb-10">
                    <div className="w-44 h-44 rounded-[4rem] p-1.5 bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-2xl relative">
                        <div className="w-full h-full bg-[#1A2538] rounded-[3.8rem] overflow-hidden border-4 border-[#0B1221]">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Morales&backgroundColor=b6e3f4&clothing=graphicShirt"
                                alt="User Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Status Glow */}
                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 border-4 border-[#0B1221] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">
                        {user?.username || 'John Algie Morales'}
                    </h2>
                    <p className="text-blue-500 font-black text-[0.7rem] uppercase tracking-[0.4em] italic opacity-80">
                        VERIFIED PASSENGER • PREMIUM MEMBER
                    </p>
                </div>

                {/* Account Actions Cards */}
                <div className="space-y-4 px-2 flex-1">
                    {[
                        { icon: User, label: 'PERSONAL INFORMATION', action: () => alert('Viewing Personal Information Profile') },
                        { icon: ShieldCheck, label: 'SECURITY & TRAVEL LOGS', action: () => alert('Accessing Security & Travel Logs') },
                        { icon: Activity, label: 'SETTINGS & ACCESSIBILITY', action: () => setProfileView('accessibility') }
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={item.action}
                            className="w-full bg-[#151D2E]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-[#1A2538]"
                        >
                            <div className="flex items-center space-x-6">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <item.icon size={26} strokeWidth={2.5} />
                                </div>
                                <span className="font-extrabold text-lg text-white italic tracking-tight uppercase">{item.label}</span>
                            </div>
                            <ChevronRight size={22} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ))}
                </div>

                {/* Futuristic Sign Out Panel */}
                <div className="mt-12 px-2 pb-10">
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full bg-red-600 text-white py-7 rounded-[2rem] font-black text-xl shadow-[0_15px_30px_-5px_rgba(220,38,38,0.5)] active:scale-95 transition-all flex items-center justify-center space-x-4 uppercase italic tracking-[0.2em] border-b-[10px] border-red-800"
                    >
                        <LogOut size={28} strokeWidth={3} />
                        <span>Sign Out Panel</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={`relative h-screen overflow-hidden flex flex-col items-center transition-colors duration-500 ${accessibility.highContrast ? 'bg-slate-950 text-white' : 'bg-slate-900'}`}>
            <div className={`w-full max-w-[480px] h-full relative flex flex-col shadow-2xl`}>
                <div className="absolute inset-0 z-0">
                    <RouteMap />
                </div>

                <div className={`absolute top-0 left-0 right-0 z-[70] p-6 pt-10 flex flex-col space-y-4 ${activeTab !== 'map' ? 'bg-[#0B1221] shadow-sm' : 'bg-gradient-to-b from-black/20 to-transparent'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <MapPin className="text-red-500" size={24} />
                            <h1 className={`text-xl font-black uppercase italic text-white`}>Inclu<span className="text-red-500">.Route</span></h1>
                        </div>
                        <button onClick={() => { setActiveTab('profile'); setProfileView('main'); }} className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                        </button>
                    </div>

                    {activeTab === 'map' && (
                        <div className="rounded-[2.5rem] p-5 flex items-center space-x-5 bg-[#0B1221] backdrop-blur-2xl border border-white/10 shadow-2xl">
                            <div className="bg-blue-600 w-16 h-16 rounded-[1.2rem] flex items-center justify-center shadow-2xl">
                                <Compass className={`text-white ${!currentAddress ? 'animate-spin' : 'animate-spin-slow'}`} size={32} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[0.6rem] font-black text-blue-500 uppercase tracking-widest italic mb-1">Live Roadmap Feed</p>
                                <h3 className="font-black text-white text-xl uppercase italic truncate">{currentAddress || 'Syncing...'}</h3>
                            </div>
                        </div>
                    )}
                </div>

                {activeTab === 'map' && (
                    <div className="absolute inset-0 flex items-center px-6 z-20 pointer-events-none">
                        <div className="w-full pointer-events-auto">
                            <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} favorites={popularDestinations} />
                        </div>
                    </div>
                )}

                {activeTab === 'favorites' && renderFavorites()}
                {activeTab === 'profile' && renderProfile()}

                <div className={`absolute bottom-0 left-0 right-0 z-[75] bg-[#0B1221]/80 backdrop-blur-3xl border-t border-white/20 shadow-2xl rounded-t-[3rem] pb-2`}>
                    <div className="flex justify-around py-6 pb-10 px-10">
                        <NavButton id="map" icon={Home} label="Map" />
                        <NavButton id="favorites" icon={Heart} label="Saved" />
                        <NavButton id="profile" icon={User} label="Profile" />
                    </div>
                </div>
            </div>
        </div>
    );
}
