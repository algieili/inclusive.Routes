import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Heart, User, ArrowLeft, Star, Heart as HeartIcon, Navigation, Bus, ChevronRight, Share2 } from 'lucide-react';
import RouteMap from '../components/Shared/RouteMap';
import { useRoute } from '../context/RouteContext';
import { calculateFare } from '../utils/fareCalculator';

export default function NavigationRoute() {
    const navigate = useNavigate();
    const { currentRoute, favorites, addFavorite, removeFavorite, isFavorite } = useRoute();
    const [activeTab, setActiveTab] = useState('map');
    const [view, setView] = useState('route'); // 'route' | 'payment' | 'receipt'
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [fareDetails, setFareDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Use currentRoute from context, fallback to default data
    const routeData = currentRoute || {
        destination: 'Crossing',
        location: 'Coolbase iCity',
        destinationLocation: { lat: 14.32, lng: 121.08 }, // Fallback coordinates
        distance: '5 Km',
        totalTime: '15 min',
        transportOption: {
            type: 'Corelora Jeepney',
            route: 'Crossing - Jeepney',
            price: '₱12.00',
            trafficStatus: 'Light Traffic',
            icon: '🚌'
        }
    };

    useEffect(() => {
        // Pre-calculate fare
        const distanceNum = parseFloat(routeData.distance);
        const fare = calculateFare(distanceNum, 'REGULAR');
        setFareDetails(fare);
    }, [routeData.distance]);

    const handleStartRoute = () => {
        // Start GPS navigation (triggers real-time location tracking)
        if (window.startMapNavigation) {
            window.startMapNavigation();
        }
        setView('payment');
    };

    const handlePayment = (method) => {
        setSelectedPaymentMethod(method);
        setIsProcessing(true);
        // Simulate payment processing (instant feel for user)
        setTimeout(() => {
            setIsProcessing(false);
            setView('receipt');
        }, 800);
    };

    const handleBack = () => {
        if (view === 'payment') {
            setView('route');
        } else if (view === 'receipt') {
            setView('route');
        } else {
            navigate('/dashboard');
        }
    };

    const toggleFavorite = () => {
        if (isFavorite(routeData.destination)) {
            removeFavorite(routeData.destination);
        } else {
            addFavorite({
                name: routeData.destination,
                location: routeData.location,
                coordinates: [121.0644, 14.6760]
            });
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'favorites':
                return (
                    <div className="absolute inset-0 bg-white z-10 p-6 overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 font-black uppercase tracking-tighter italic">Favorites</h2>
                        <div className="space-y-4">
                            {favorites.length === 0 ? (
                                <p className="text-slate-500 text-center py-8 font-bold italic">No favorites yet</p>
                            ) : (
                                favorites.map((fav, index) => (
                                    <div key={index} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Star className="text-blue-600 fill-blue-600" size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{fav.name}</h3>
                                                    <p className="text-slate-500 text-sm">{fav.location}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFavorite(fav.name)} className="text-red-500 hover:text-red-600 font-bold text-sm uppercase">Remove</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="absolute inset-0 bg-white z-10 p-6 overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 font-black uppercase tracking-tighter italic">My Profile</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-20 h-20 bg-slate-200 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic leading-none">Felix Passenger</h3>
                                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Verified User • Inclusive.Route</p>
                                </div>
                            </div>
                            <button className="w-full bg-slate-50 p-5 rounded-3xl text-left font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between group border border-slate-100 shadow-sm">
                                <span className="uppercase tracking-widest text-xs">Account Settings</span>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform text-slate-300" />
                            </button>
                            <button className="w-full bg-slate-50 p-5 rounded-3xl text-left font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between group border border-slate-100 shadow-sm">
                                <span className="uppercase tracking-widest text-xs">Accessibility Options</span>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform text-slate-300" />
                            </button>
                            <button onClick={() => navigate('/')} className="w-full bg-red-600 p-5 rounded-3xl text-center font-black text-white hover:bg-red-700 shadow-xl shadow-red-200 uppercase tracking-[0.2em] transition-all active:scale-95 mt-8">
                                Logout
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative h-screen bg-slate-100 overflow-hidden flex flex-col">
            {/* LAYER 1: PERSISTENT BACKGROUND - The Map */}
            <div className="absolute inset-0 z-0">
                <RouteMap />
            </div>

            {/* LAYER 2: HEADER (Always visible except possibly during transitions) */}
            <div className={`absolute top-0 left-0 right-0 z-50 p-4 pt-8 pb-12 flex justify-between items-center bg-gradient-to-b from-white/95 to-transparent pointer-events-none transition-opacity duration-300 ${view === 'receipt' ? 'opacity-0' : 'opacity-100'}`}>
                <button
                    onClick={handleBack}
                    className="pointer-events-auto bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-xl hover:bg-white transition-all border border-white/50 group active:scale-90"
                >
                    <ArrowLeft className="text-slate-700 group-hover:-translate-x-1 transition-transform" size={24} strokeWidth={3} />
                </button>
                <div className="flex items-center space-x-2 pointer-events-auto">
                    <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-50">
                        <MapPin className="text-red-500 fill-current" size={26} />
                    </div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">
                        Inclu<span className="text-red-500">.Route</span>
                    </h1>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl border-2 border-white shadow-xl pointer-events-auto overflow-hidden">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* LAYER 3: DYNAMIC OVERLAYS (Conditional UI based on 'view' and 'activeTab') */}

            {/* Current Route Preview (Main View) */}
            {view === 'route' && activeTab === 'map' && (
                <div className="absolute bottom-24 left-4 right-4 z-20 animate-in slide-in-from-bottom-20 fade-in duration-500">
                    <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
                        {/* Destination Header */}
                        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 px-6 py-4 flex items-center justify-between border-b border-yellow-200/50">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-inner flex items-center justify-center text-3xl animate-bounce">🚌</div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-xl tracking-tight leading-none flex items-center space-x-2">
                                        <span>{routeData.destination}</span>
                                    </h3>
                                    <p className="text-slate-500 text-[0.65rem] font-black uppercase tracking-widest mt-1">
                                        ETA • {routeData.totalTime}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleFavorite}
                                className={`p-3 rounded-2xl transition-all active:scale-90 ${isFavorite(routeData.destination) ? 'bg-red-50' : 'bg-white'}`}
                            >
                                <Heart
                                    className={isFavorite(routeData.destination) ? 'text-red-500 fill-red-500' : 'text-slate-300'}
                                    size={24}
                                    strokeWidth={3}
                                />
                            </button>
                        </div>

                        {/* Transport Option Details */}
                        <div className="p-6 space-y-4">
                            <div className="bg-slate-50/50 p-5 rounded-3xl flex items-center justify-between border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                                        <span className="text-2xl">🚌</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{routeData.transportOption.type}</h4>
                                        <p className="text-slate-400 text-[0.6rem] font-bold uppercase tracking-widest">Main Road / Highway Route</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800 text-2xl tracking-tighter">{routeData.transportOption.price}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleStartRoute}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xl py-6 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)] transition-all active:scale-95 uppercase tracking-[0.2em] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
                                START ROUTE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Overlay */}
            {view === 'payment' && (
                <div className="absolute inset-0 z-[60] bg-[#00E5FF] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>

                    <button
                        onClick={handleBack}
                        className="absolute top-8 left-8 bg-white/30 backdrop-blur-md p-3 rounded-2xl hover:bg-white/40 transition-all border border-white/40 shadow-xl active:scale-90"
                    >
                        <ArrowLeft className="text-white" size={24} strokeWidth={3} />
                    </button>

                    <div className="w-full max-w-sm z-10 text-center">
                        <h1 className="text-red-600 font-black text-7xl mb-12 tracking-[0.25em] drop-shadow-[0_4px_4px_rgba(255,255,255,0.4)] uppercase italic">
                            FARE
                        </h1>

                        {/* Amount Card */}
                        <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] p-12 mb-10 border border-white/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[6rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Total Amount Due</p>
                            <h1 className="text-7xl font-black text-slate-800 tracking-tighter leading-none italic">
                                ₱{fareDetails?.netFare || '13.00'}
                            </h1>
                        </div>

                        {/* Instant Payment Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { id: 'GCash', label: 'GC', color: 'blue', icon: 'G' },
                                { id: 'GrabPay', label: 'GP', color: 'green', icon: 'Grab' },
                                { id: 'Maya', label: 'MY', color: 'slate', icon: 'M' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => handlePayment(method.id)}
                                    className="aspect-square bg-white rounded-[2rem] shadow-xl flex flex-col items-center justify-center border-2 border-transparent transition-all active:scale-90 hover:scale-105"
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-${method.color}-100 flex items-center justify-center mb-2`}>
                                        <span className={`text-${method.color}-600 font-black text-2xl italic`}>{method.icon}</span>
                                    </div>
                                    <span className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">{method.id}</span>
                                </button>
                            ))}
                        </div>

                        <p className="text-white/60 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Select Payment for Instant Receipt</p>
                    </div>
                </div>
            )}

            {/* E-Receipt Overlay */}
            {view === 'receipt' && (
                <div className="absolute inset-0 z-[70] bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="w-full max-w-md z-10 animate-in zoom-in-90 duration-500">
                        <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 relative group">
                            {/* Receipt Header */}
                            <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full -mr-24 -mt-24 selection:bg-transparent"></div>
                                <div className="w-28 h-28 bg-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_25px_50px_-12px_rgba(34,197,94,0.5)] rotate-12 transition-all hover:rotate-0 hover:scale-110">
                                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={6} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <h2 className="text-white font-black text-4xl tracking-tighter uppercase mb-2 leading-none">
                                    PAYMENT<br />SUCCESSFUL
                                </h2>
                                <div className="inline-block bg-green-500 px-5 py-2 rounded-2xl mt-4 animate-pulse">
                                    <p className="text-white text-xs font-black uppercase tracking-[0.2em] italic">
                                        "IPAKITA PO SA OPERATOR"
                                    </p>
                                </div>
                            </div>

                            <div className="p-10 space-y-10 bg-slate-50">
                                {/* Amount */}
                                <div className="text-center pb-8 border-b-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 text-[0.7rem] font-black uppercase tracking-[0.4em] mb-3">Fare Amount Paid</p>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span className="text-slate-400 font-bold text-3xl mb-4">₱</span>
                                        <h1 className="text-7xl font-black text-slate-900 tracking-tighter">{fareDetails?.netFare || '13.00'}</h1>
                                    </div>
                                </div>

                                {/* Detailed Trip Grid */}
                                <div className="grid grid-cols-2 gap-y-8">
                                    <div>
                                        <p className="text-slate-400 text-[0.6rem] font-black uppercase tracking-[0.2em] mb-1">To Destination</p>
                                        <p className="font-black text-slate-800 text-lg tracking-tight truncate pr-2">{routeData.destination}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-[0.6rem] font-black uppercase tracking-[0.2em] mb-1">Payment via</p>
                                        <p className="font-black text-slate-800 text-lg uppercase">{selectedPaymentMethod || 'GCash'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[0.6rem] font-black uppercase tracking-[0.2em] mb-1">Distance</p>
                                        <p className="font-black text-slate-800 text-lg uppercase">{routeData.distance}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-[0.6rem] font-black uppercase tracking-[0.2em] mb-1">Timestamp</p>
                                        <p className="font-black text-slate-800 text-sm uppercase">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-100 flex items-center justify-center space-x-3 border-t border-slate-200">
                                <div className="bg-white p-2 rounded-xl shadow-sm">
                                    <MapPin className="text-red-500 fill-current" size={18} />
                                </div>
                                <span className="text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.3em]">Inclusive.Route Official Receipt</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setView('route');
                                setActiveTab('map');
                            }}
                            className="w-full mt-10 bg-green-500 hover:bg-green-600 text-white font-black py-7 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] text-sm flex items-center justify-center space-x-4 border-b-8 border-green-700 hover:border-b-4 hover:translate-y-1"
                        >
                            <span>DONE • MONITOR TRIP</span>
                            <ArrowLeft className="rotate-180" size={24} strokeWidth={4} />
                        </button>
                    </div>
                </div>
            )}

            {/* LAYER 4: TAB CONTENT (Favorites / Profile) */}
            {renderTabContent()}

            {/* LAYER 5: BOTTOM NAVIGATION (Only visible in 'route' view) */}
            <div className={`absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] transition-transform duration-500 ${view === 'route' ? 'translate-y-0' : 'translate-y-[100%]'}`}>
                <div className="flex items-center justify-around py-4 px-8 pb-10">
                    <button
                        onClick={() => setActiveTab('map')}
                        className={`flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'map' ? 'text-red-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Home size={26} strokeWidth={activeTab === 'map' ? 3 : 2} />
                        <span className="text-[0.65rem] font-black uppercase tracking-widest">Map</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'favorites' ? 'text-red-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <HeartIcon size={26} strokeWidth={activeTab === 'favorites' ? 3 : 2} />
                        <span className="text-[0.65rem] font-black uppercase tracking-widest">Saved</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'profile' ? 'text-red-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <User size={26} strokeWidth={activeTab === 'profile' ? 3 : 2} />
                        <span className="text-[0.65rem] font-black uppercase tracking-widest">Me</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
