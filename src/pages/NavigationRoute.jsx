import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Heart, User, ArrowLeft, Star, Navigation, Bus, ChevronRight, CheckCircle } from 'lucide-react';
import RouteMap from '../components/Shared/RouteMap';
import { useRoute } from '../context/RouteContext';
import { useAuth } from '../context/AuthContext';
import { calculateFare } from '../utils/fareCalculator';

export default function NavigationRoute() {
    const navigate = useNavigate();
    const { accessibility } = useAuth();
    const { currentRoute, favorites, addFavorite, removeFavorite, isFavorite } = useRoute();
    const [view, setView] = useState('route'); // 'route' | 'payment' | 'receipt' | 'navigating'
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [fareDetails, setFareDetails] = useState(null);

    const routeData = currentRoute || {
        destination: 'Crossing',
        location: 'Coolbase iCity',
        destinationLocation: { lat: 14.3720, lng: 121.0950 },
        distance: '5.2 Km',
        totalTime: '15 min',
        transportOption: {
            type: 'Jeepney',
            route: 'Crossing',
            price: '₱13.00',
            trafficStatus: 'Light'
        }
    };

    useEffect(() => {
        const distanceNum = parseFloat(routeData.distance);
        const fare = calculateFare(distanceNum, 'REGULAR');
        setFareDetails(fare);
    }, [routeData.distance]);

    const handleStartRoute = () => setView('payment');

    const handlePayment = (method) => {
        setSelectedPaymentMethod(method);
        setTimeout(() => setView('receipt'), 800);
    };

    const handleFinishTrip = () => {
        setView('navigating');
        if (window.startMapNavigation) {
            window.startMapNavigation();
        }
    };

    const handleBack = () => {
        if (view === 'payment') setView('route');
        else if (view === 'receipt') setView('route');
        else if (view === 'navigating') setView('route');
        else navigate('/dashboard');
    };

    return (
        <div className={`relative h-[100dvh] w-full overflow-hidden flex flex-col items-center transition-colors duration-500 ${accessibility.highContrast ? 'bg-slate-950 text-white' : 'bg-slate-900 text-slate-900'}`}>
            <div className={`w-full max-w-[480px] h-full relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white ${accessibility.highContrast ? 'bg-slate-900/50' : ''}`}>

                {/* 1. Map Layer */}
                <div className="absolute inset-0 z-0">
                    <RouteMap />
                </div>

                {/* 2. Header */}
                <div className={`absolute top-0 left-0 right-0 z-50 p-6 pt-10 flex justify-between items-center bg-gradient-to-b from-black/30 to-transparent transition-opacity ${view === 'receipt' ? 'opacity-0' : 'opacity-100'}`}>
                    <button onClick={handleBack} className={`p-3 rounded-2xl shadow-2xl border transition-all active:scale-90 ${accessibility.highContrast ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white/95 border-white text-slate-800'}`}>
                        <ArrowLeft size={24} strokeWidth={4} />
                    </button>
                    <div className="flex items-center space-x-2">
                        <h1 className={`text-xl font-black drop-shadow-lg tracking-tighter uppercase italic ${accessibility.highContrast ? 'text-white' : 'text-white'}`}>
                            Inclu<span className="text-red-500">.Route</span>
                        </h1>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl border-2 shadow-2xl overflow-hidden ${accessibility.highContrast ? 'border-red-500' : 'border-white'}`}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* 3. Main Route Overlay */}
                {view === 'route' && (
                    <div className="absolute bottom-10 left-6 right-6 z-20 animate-in slide-in-from-bottom-10 duration-500">
                        <div className={`rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border transition-colors ${accessibility.highContrast ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white/95 backdrop-blur-xl border-white/50'}`}>
                            <div className={`p-8 flex items-center justify-between transition-colors ${accessibility.highContrast ? 'bg-slate-800' : 'bg-[#FF4A3F] text-white'}`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner ${accessibility.highContrast ? 'bg-slate-700' : 'bg-white/20'}`}>🚌</div>
                                    <div>
                                        <h3 className={`font-black italic uppercase tracking-tighter leading-none ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>{routeData.destination}</h3>
                                        <p className={`text-[0.6rem] font-black uppercase tracking-widest mt-1 italic ${accessibility.highContrast ? 'text-slate-400' : 'text-red-100'}`}>ETA • {routeData.totalTime}</p>
                                    </div>
                                </div>
                                <button onClick={() => isFavorite(routeData.destination) ? removeFavorite(routeData.destination) : addFavorite({ name: routeData.destination, location: routeData.location })} className={`p-4 rounded-2xl transition-all active:scale-90 ${accessibility.highContrast ? 'bg-slate-700 text-red-500' : 'bg-white/10 text-white'}`}>
                                    <Heart className={isFavorite(routeData.destination) ? 'fill-current' : ''} size={28} />
                                </button>
                            </div>
                            <div className="p-10">
                                <div className={`flex items-center justify-around mb-10 py-6 rounded-[2rem] border transition-all ${accessibility.highContrast ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="text-center">
                                        <p className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest mb-1 italic">TIME</p>
                                        <p className={`font-black tracking-tighter italic ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>{routeData.totalTime}</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-200"></div>
                                    <div className="text-center">
                                        <p className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest mb-1 italic">DISTANCE</p>
                                        <p className={`font-black tracking-tighter italic ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>{routeData.distance}</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-200"></div>
                                    <div className="text-center">
                                        <p className="text-[0.5rem] font-black text-red-500 uppercase tracking-widest mb-1 italic">FARE</p>
                                        <p className={`font-black text-red-500 tracking-tighter italic ${accessibility.largeText ? 'text-2xl' : 'text-xl'}`}>₱{fareDetails?.netFare || '13.00'}</p>
                                    </div>
                                </div>
                                <button onClick={handleStartRoute} className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all active:translate-y-1 active:border-b-0 border-b-[8px] ${accessibility.highContrast ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-900 text-white border-slate-700'}`}>
                                    Start Route
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Payment Overlay */}
                {view === 'payment' && (
                    <div className={`absolute inset-0 z-[60] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-300 ${accessibility.highContrast ? 'bg-slate-950' : 'bg-[#FF4A3F]'}`}>
                        <h1 className="text-white font-black text-8xl mb-12 tracking-[0.2em] italic uppercase drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]">FARE</h1>
                        <div className={`rounded-[4rem] p-12 w-full shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] text-center mb-10 transition-colors ${accessibility.highContrast ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                            <p className="text-slate-400 text-[0.7rem] font-black uppercase tracking-[0.3em] mb-4">Amount to Pay</p>
                            <h2 className={`font-black italic tracking-tighter leading-none ${accessibility.largeText ? 'text-9xl' : 'text-8xl'}`}>₱{fareDetails?.netFare}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-6 w-full px-4">
                            {['GCash', 'Maya'].map(method => (
                                <button key={method} onClick={() => handlePayment(method)} className={`p-8 rounded-[3rem] shadow-2xl font-black uppercase tracking-widest flex flex-col items-center space-y-4 active:scale-90 transition-all ${accessibility.highContrast ? 'bg-slate-900 text-white border-2 border-slate-700' : 'bg-white text-slate-800 border-none'}`}>
                                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4A3F] font-black text-3xl shadow-inner">{method[0]}</div>
                                    <span className="text-[0.75rem] tracking-tighter">{method}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. E-Receipt Overlay */}
                {view === 'receipt' && (
                    <div className="absolute inset-0 z-[70] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
                        <div className={`rounded-[2.5rem] w-full max-w-[400px] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden transition-all border border-white/10 ${accessibility.highContrast ? 'bg-slate-900 border-2 border-green-500' : 'bg-white'}`}>
                            {/* Receipt Header */}
                            <div className="bg-green-500 p-10 text-center text-white relative">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="w-20 h-20 bg-white/20 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30 backdrop-blur-md">
                                    <CheckCircle size={40} strokeWidth={4} />
                                </div>
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-md">PAYMENT<br />SUCCESS</h1>
                                <div className="mt-4 flex flex-col items-center space-y-1">
                                    <p className="text-[0.6rem] font-bold text-green-100 uppercase tracking-[0.2em] italic">Transaction ID: IR-9923410</p>
                                    <p className="text-[0.6rem] font-bold text-green-100 uppercase tracking-[0.2em] italic">{new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Receipt Content */}
                            <div className="p-8 pb-10 text-center">
                                <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <p className="text-slate-400 font-bold text-[0.65rem] uppercase tracking-widest mb-2 italic">Official Fare Amount</p>
                                    <h2 className={`font-black text-slate-800 tracking-tighter italic ${accessibility.largeText ? 'text-8xl' : 'text-7xl'} ${accessibility.highContrast ? 'text-white' : ''}`}>₱{fareDetails?.netFare}</h2>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest italic">Destination</span>
                                        <span className="text-[0.7rem] font-black text-slate-700 uppercase italic truncate max-w-[150px]">{routeData.destination}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest italic">Payment Method</span>
                                        <span className="text-[0.7rem] font-black text-slate-700 uppercase italic">{selectedPaymentMethod || 'E-Wallet'}</span>
                                    </div>
                                    <div className="w-full border-t border-dashed border-slate-200 my-4"></div>
                                    <p className="text-[0.75rem] font-black text-green-600 uppercase tracking-[0.3em] italic animate-pulse">
                                        "i-present po ito sa driver"
                                    </p>
                                </div>

                                <button onClick={handleFinishTrip} className={`w-full font-black py-7 rounded-[2rem] uppercase tracking-[0.4em] text-xs flex items-center justify-center space-x-4 active:scale-95 transition-all shadow-2xl ${accessibility.highContrast ? 'bg-white text-slate-900 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/40'}`}>
                                    <span>Proceed to Nav</span>
                                    <ChevronRight size={22} strokeWidth={4} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
