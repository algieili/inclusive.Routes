
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, CreditCard, ChevronRight, Bus, Navigation } from 'lucide-react';
import { calculateFare } from '../utils/fareCalculator';
import RouteMap from '../components/Shared/RouteMap';
import { useRoute } from '../context/RouteContext';
import PlacesAutocomplete from '../components/Shared/PlacesAutocomplete';

export default function PassengerDashboard() {
    const navigate = useNavigate();
    const { setRoute } = useRoute();
    const [destination, setDestination] = useState('');
    const [view, setView] = useState('search'); // 'search' | 'map' | 'payment' | 'receipt'
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [receiptData, setReceiptData] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentAddress, setCurrentAddress] = useState('');
    const [locationError, setLocationError] = useState(null);

    // Get user's current location and address
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentLocation(pos);

                    // Reverse geocode to get address
                    const google = window.google;
                    if (google && google.maps && google.maps.Geocoder) {
                        const geocoder = new google.maps.Geocoder();
                        geocoder.geocode({ location: pos }, (results, status) => {
                            if (status === 'OK' && results[0]) {
                                // Extract a shorter version of the address if possible
                                const addr = results[0].formatted_address;
                                setCurrentAddress(addr.split(',').slice(0, 2).join(','));
                            }
                        });
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationError('Unable to get your location. Using default location.');
                    // Fallback to San Pedro, Laguna
                    setCurrentLocation({ lat: 14.3553, lng: 121.0644 });
                    setCurrentAddress('San Pedro, Laguna');
                }
            );
        } else {
            setLocationError('Geolocation not supported');
            setCurrentLocation({ lat: 14.3553, lng: 121.0644 });
        }
    }, []);

    // Mock Popular Destinations (kept for quick access)
    const popularDestinations = [
        { name: "Crossing", location: "Coolbase iCity", color: "bg-orange-100 text-orange-600", iconC: "bg-orange-200" },
        { name: "Pulo", location: "Coolbase Area", color: "bg-red-100 text-red-600", iconC: "bg-red-200" },
        { name: "Market Area", location: "Midas iCity", color: "bg-green-100 text-green-600", iconC: "bg-green-200" },
        { name: "Banlic", location: "Midas iCity", color: "bg-orange-100 text-orange-600", iconC: "bg-orange-200" },
        { name: "Malaban", location: "Malaban iCity", color: "bg-blue-100 text-blue-600", iconC: "bg-blue-200" }
    ];

    const handleSearch = (e) => {
        setDestination(e.target.value);
    };

    // Handle place selected from autocomplete
    const handlePlaceSelected = (place) => {
        if (!currentLocation) {
            alert('Getting your location... Please try again.');
            return;
        }

        // Calculate distance using Google Maps Geometry API
        const google = window.google;
        if (!google || !google.maps) return;

        const origin = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
        const dest = new google.maps.LatLng(place.location.lat, place.location.lng);
        const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(origin, dest);
        const distanceKm = (distanceMeters / 1000).toFixed(1);
        const fare = calculateFare(parseFloat(distanceKm));

        const routeData = {
            origin: currentLocation,
            destination: place.name,
            destinationLocation: place.location,
            destinationAddress: place.address,
            distance: `${distanceKm} Km`,
            totalTime: `${Math.round(parseFloat(distanceKm) * 3)} min`,
            transportOption: {
                type: 'Jeepney',
                route: `${place.name}`,
                price: `₱${fare.netFare}`,
                trafficStatus: 'Calculating...'
            },
            useRealDirections: true // Flag to use Google Directions API
        };

        setDestination(place.name);
        setSelectedRoute(routeData);
        setRoute(routeData);
        navigate('/navigate');
    };

    const handlePayment = (method) => {
        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
            setReceiptData({
                date: new Date().toLocaleString(),
                amount: "39.00",
                method: method
            });
            setView('receipt');
            setPaymentStatus('idle');
        }, 1500);
    };

    if (view === 'receipt' && receiptData) {
        return (
            <div className="h-full bg-slate-50 p-6 flex flex-col items-center justify-center relative">
                <button
                    onClick={() => setView('search')}
                    className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm text-slate-500"
                >
                    <ChevronRight className="rotate-180" size={24} />
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">E-Receipt</h2>

                <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden relative">
                    {/* Receipt Tear Effect (Visual Mock) */}
                    <div className="bg-slate-800 h-2 w-full"></div>

                    <div className="p-8 space-y-4">
                        <div className="text-center border-b border-slate-100 pb-6 mb-4">
                            <p className="text-slate-500 text-sm mb-1">Today's Fare Collection</p>
                            <h1 className="text-4xl font-extrabold text-slate-800">Php {receiptData.amount}</h1>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Regular Fare</span>
                                <span className="font-bold">Php 900.00</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Discounted Fare</span>
                                <span className="font-bold">Php 720.00</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Fare Adjustment</span>
                                <span className="font-bold">Php 750.00</span>
                            </div>
                            <div className="border-t border-slate-100 pt-3 flex justify-between text-slate-800 font-bold text-lg">
                                <span>Total:</span>
                                <span>Php 1,850.00</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2">
                            <CreditCard size={18} />
                            <span>Share E-Receipt</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (view === 'payment') {
        return (
            <div className="h-full bg-cyan-400 p-6 flex flex-col items-center relative">
                <button
                    onClick={() => setView('map')}
                    className="absolute top-4 left-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-md"
                >
                    <ChevronRight className="rotate-180" size={28} />
                </button>

                <div className="w-full max-w-sm mt-8 text-center">
                    <h1 className="text-red-500 font-black text-4xl mb-8 tracking-widest drop-shadow-sm uppercase">FARE</h1>

                    <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
                        <div className="text-slate-800 font-bold text-3xl py-4">
                            Php. 39.00
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Mock Payment Buttons */}
                        <div className="bg-white rounded-xl p-4 shadow-md flex items-center justify-center h-16 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handlePayment('GCash')}>
                            <span className="text-blue-600 font-bold text-xl flex items-center"><span className="mr-1">G</span> GCash</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md flex items-center justify-center h-16 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handlePayment('GrabPay')}>
                            <span className="text-green-600 font-bold text-xl">GrabPay</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md flex items-center justify-center h-16 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handlePayment('PayMaya')}>
                            <span className="text-green-500 font-bold text-xl flex items-center"><span className="bg-green-500 text-white rounded p-0.5 mr-1 text-xs">P</span> PayMaya</span>
                        </div>

                        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-black text-2xl py-4 rounded-xl shadow-lg mt-8 uppercase tracking-wider">
                            PAY NOW
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-screen bg-slate-100 overflow-hidden">
            {/* 1. Map Layer - Always in background */}
            <div className="absolute inset-0 z-0">
                <RouteMap />
            </div>

            {/* 2. Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent pt-8 pb-12 pointer-events-none">
                <div className="flex items-center space-x-2 pointer-events-auto">
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <MapPin className="text-red-500 fill-current" size={28} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        Inclusive<span className="text-red-500">.Route</span>
                    </h1>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl border-2 border-white shadow-md pointer-events-auto overflow-hidden">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* 3. Floating Search & Popular Destinations */}
            {view === 'search' && (
                <div className="absolute top-24 left-6 right-6 z-30 pointer-events-auto flex flex-col space-y-4 max-h-[70vh] animate-in slide-in-from-top-10 duration-500">
                    {/* Current Location Hook */}
                    <div className="bg-blue-600 rounded-[2rem] p-5 text-white shadow-2xl flex items-center space-x-4 border border-blue-400 group active:scale-[0.98] transition-transform">
                        <div className="bg-white/20 p-3 rounded-2xl shadow-inner relative overflow-hidden">
                            <MapPin size={26} fill="white" className="relative z-10" />
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-white/60 text-[0.55rem] font-black uppercase tracking-[0.25em] mb-1 italic">You are currently here</p>
                            <h3 className="font-black text-lg tracking-tight truncate leading-none">
                                {currentAddress || "Locating your GPS..."}
                            </h3>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>

                    {/* HUGE DESTINATION PROMPT */}
                    <div className="px-2 py-2 flex items-end justify-between">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85] drop-shadow-xl animate-in fade-in zoom-in duration-700">
                            CHOOSE<br />
                            <span className="text-blue-600">DESTINATION</span>
                        </h2>
                        <span className="text-6xl animate-bounce mb-2">🚌</span>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-1.5 border border-white/50">
                        <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} />
                    </div>

                    {/* Popular Destinations Scrollable Card */}
                    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-[2.5rem] p-6 border border-white/50 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-blue-600 font-black text-xl tracking-tight uppercase">Recent Favorites</h2>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[40vh]">
                            {popularDestinations.map((dest, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePlaceSelected({
                                        name: dest.name,
                                        location: { lat: 14.32, lng: 121.08 }, // Mock coords for quick demo
                                        address: dest.location
                                    })}
                                    className="w-full bg-white/60 p-4 rounded-2xl border border-blue-50 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-between group active:scale-[0.98]"
                                >
                                    <div className="flex items-center space-x-4 text-left">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dest.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <Bus size={22} className="group-hover:rotate-12 transition-transform" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{dest.name}</h3>
                                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{dest.location}</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Location Status Indicator */}
            <div className="absolute bottom-10 left-6 z-20 pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-100 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-[0.7rem] font-black text-slate-700 uppercase tracking-widest leading-none">GPS Live</span>
                </div>
            </div>

            {/* 5. Quick Action Button (Lower Right) */}
            <div className="absolute bottom-10 right-6 z-20 pointer-events-auto">
                <button
                    onClick={() => setView('search')}
                    className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] shadow-2xl shadow-blue-400/50 flex items-center justify-center transition-all hover:rotate-12 active:scale-90"
                >
                    <Navigation size={28} fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
