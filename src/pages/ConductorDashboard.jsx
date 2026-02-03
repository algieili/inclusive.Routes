
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, RefreshCw, Bus, DollarSign, User, Receipt, Plus, ChevronRight, CheckCircle2, Home, Mail, List, ArrowLeft, Sun, Moon, Eye, Volume2, LogOut, MapPin, Search, Clock, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RouteMap from '../components/Shared/RouteMap';

export default function ConductorDashboard() {
    const navigate = useNavigate();
    const { user, logout, accessibility, updateAccessibility } = useAuth();
    const [activeTab, setActiveTab] = useState('Fare Reports');
    const [bottomNav, setBottomNav] = useState('Reports');
    const [profileView, setProfileView] = useState('main');
    const [isCollecting, setIsCollecting] = useState(false);
    const [collectedTotal, setCollectedTotal] = useState(1850.00);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualAmount, setManualAmount] = useState('');
    const [showReportDetails, setShowReportDetails] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const toggleSetting = (key) => {
        updateAccessibility({ [key]: !accessibility[key] });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleManualCollect = () => {
        const amount = parseFloat(manualAmount);
        if (amount > 0) {
            setIsCollecting(true);
            setTimeout(() => {
                setCollectedTotal(prev => prev + amount);
                setIsCollecting(false);
                setShowManualEntry(false);
                setManualAmount('');
            }, 800);
        }
    };

    const renderHeader = () => (
        <div className={`flex justify-between items-center px-6 pt-10 pb-4 relative z-10 transition-colors ${accessibility.highContrast ? 'bg-slate-900/80 backdrop-blur-md' : 'bg-white/40 backdrop-blur-md'}`}>
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100/90 rounded-2xl flex items-center justify-center shadow-lg border border-red-50">
                    <MapPin className="text-red-500 fill-current" size={20} />
                </div>
                <h1 className={`text-xl font-black tracking-tighter uppercase italic leading-none ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>
                    Inclusive <span className="text-slate-400">Route</span>
                </h1>
            </div>
            <button
                onClick={() => { setBottomNav('Profile'); setProfileView('accessibility'); }}
                className={`p-2.5 rounded-2xl transition-all active:scale-95 ${accessibility.highContrast ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white/80 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100'}`}
            >
                <Settings size={22} />
            </button>
        </div>
    );

    const renderTabs = () => (
        <div className={`mx-6 mt-4 p-1.5 rounded-[2rem] flex items-center transition-colors relative z-10 ${accessibility.highContrast ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-100/80 backdrop-blur-md border border-white'}`}>
            {['Fare Reports', 'Fare Collection', 'E-Receipt'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 rounded-full text-[0.6rem] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-lg'
                            : accessibility.highContrast ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );

    const renderFareReports = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 px-6 mt-6 pb-6">
            {/* Total Fare Card */}
            <div className={`rounded-[3.5rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group transition-all border-b-[8px] active:scale-[0.98] ${accessibility.highContrast ? 'bg-slate-900 border-indigo-600' : 'bg-white border-blue-100'}`}>
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-bl-[6rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 ${accessibility.highContrast ? 'bg-indigo-500/10' : 'bg-blue-50/50'}`}></div>
                <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-amber-50 group-hover:rotate-12 transition-transform">
                        <span className="text-5xl">💰</span>
                    </div>
                    <h3 className={`font-black text-[0.7rem] uppercase tracking-[0.4em] italic mb-3 ${accessibility.highContrast ? 'text-indigo-400' : 'text-slate-400'}`}>Total Fare Collected</h3>
                    <p className={`font-black tracking-tighter italic ${accessibility.largeText ? 'text-5xl' : 'text-4xl'} ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>
                        Php <span className="text-4xl">{collectedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </p>
                </div>
            </div>

            {/* Date & GPS Summary Bar */}
            <div className={`px-8 py-5 rounded-[2rem] border-2 flex justify-between items-center shadow-lg backdrop-blur-md ${accessibility.highContrast ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-white/80 border-white text-slate-400'}`}>
                <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-[0.65rem] font-black uppercase tracking-widest italic leading-none">Apr 24, 2024 - 7:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-[0.6rem] font-bold">Lat: <span className="font-black text-slate-800">7.5, 91</span></span>
                    <Bus size={14} className="text-slate-400" />
                </div>
            </div>

            {/* Detail Card */}
            <div className={`rounded-[3.5rem] p-10 shadow-2xl border transition-all ${accessibility.highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20">
                            <Bus size={24} className="text-white" />
                        </div>
                        <h4 className={`text-xl font-black italic uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>Fare Reports</h4>
                    </div>
                    <ChevronRight className="text-slate-300" />
                </div>

                <button
                    onClick={() => { setSelectedReport({ id: 'SIA 506', passengers: 90, earnings: 1850 }); setShowReportDetails(true); }}
                    className={`w-full p-8 rounded-[2.5rem] border-2 text-left transition-all active:scale-[0.98] ${accessibility.highContrast ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 shadow-inner'}`}
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Apr 24, 2024 - 7:00 PM</p>
                            <h5 className={`font-black italic text-xl leading-none ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>SIA 506 - <span className="text-slate-400 font-bold">PUJ-1234</span></h5>
                        </div>
                        <div className="text-right">
                            <p className="text-[0.5rem] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Today's Earnings</p>
                            <p className="text-blue-600 font-black text-lg italic tracking-tighter leading-none">Php 37,910</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t-2 border-slate-200/30">
                        <div>
                            <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Passengers</p>
                            <div className={`py-2 px-8 rounded-2xl font-black text-2xl italic tracking-tighter ${accessibility.highContrast ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}>90</div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end space-x-2 text-[0.65rem] font-black uppercase tracking-widest text-slate-400 mb-2">
                                <User size={14} />
                                <span>Earnings:</span>
                            </div>
                            <p className={`font-black italic tracking-tighter ${accessibility.largeText ? 'text-3xl' : 'text-2xl'} ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>Php 1,850.00</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => { setIsCollecting(true); setTimeout(() => setIsCollecting(false), 1500); }}
                    className={`w-full py-7 mt-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[0.75rem] flex items-center justify-center space-x-4 shadow-2xl transition-all active:translate-y-1 active:shadow-none border-b-[8px] ${accessibility.highContrast ? 'bg-teal-500 text-white border-teal-700' : 'bg-[#26A69A] text-white border-[#00796B] shadow-[#26A69A]/30'}`}
                >
                    <RefreshCw size={20} className={isCollecting ? "animate-spin" : "animate-spin-slow"} />
                    <span>Sync Terminal</span>
                </button>
            </div>
        </div>
    );

    const renderFareCollection = () => (
        <div className="px-6 space-y-6 animate-in zoom-in-95 duration-500 mt-6 relative z-10 pb-6">
            <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>Quick Collection</h2>
            <div className="grid grid-cols-2 gap-6">
                <button onClick={() => { setIsCollecting(true); setTimeout(() => { setCollectedTotal(prev => prev + 13); setIsCollecting(false); }, 600); }} className={`rounded-[3rem] p-10 shadow-xl border-2 flex flex-col items-center hover:border-blue-500 active:scale-95 transition-all ${accessibility.highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-blue-500/5'}`}>
                    <span className="text-6xl mb-4 drop-shadow-lg">🚌</span>
                    <p className="text-slate-400 font-black text-[0.7rem] uppercase tracking-widest mb-1 italic">Regular</p>
                    <span className={`font-black italic ${accessibility.largeText ? 'text-4xl' : 'text-3xl'} ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>₱13.00</span>
                </button>
                <button onClick={() => { setIsCollecting(true); setTimeout(() => { setCollectedTotal(prev => prev + 10); setIsCollecting(false); }, 600); }} className={`rounded-[3rem] p-10 shadow-xl border-2 flex flex-col items-center hover:border-teal-500 active:scale-95 transition-all ${accessibility.highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-teal-500/5'}`}>
                    <span className="text-6xl mb-4 drop-shadow-lg">♿</span>
                    <p className="text-slate-400 font-black text-[0.7rem] uppercase tracking-widest mb-1 italic">Discount</p>
                    <span className={`font-black italic ${accessibility.largeText ? 'text-4xl' : 'text-3xl'} ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>₱10.00</span>
                </button>
            </div>

            <div className={`p-10 rounded-[3.5rem] border-2 shadow-2xl flex items-center justify-between group transition-all active:scale-[0.98] ${accessibility.highContrast ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 text-white'}`}>
                <div>
                    <h4 className="font-black text-[0.7rem] uppercase tracking-[0.4em] text-blue-400 mb-2 italic leading-none">Manual Entry</h4>
                    <p className="text-white/50 text-[0.65rem] font-bold">Input custom fare amount</p>
                </div>
                <button onClick={() => setShowManualEntry(true)} className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-90 transition-all border-b-4 border-blue-800">
                    <Plus className="text-white" size={32} strokeWidth={4} />
                </button>
            </div>
        </div>
    );

    const renderEReceiptView = () => (
        <div className="px-6 space-y-6 animate-in slide-in-from-right-10 duration-500 text-center mt-6 relative z-10 pb-6">
            <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>Last E-Receipt</h2>
            <div className={`p-12 rounded-[4rem] border-2 shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all ${accessibility.highContrast ? 'bg-slate-900 border-slate-700' : 'bg-white border-white'}`}>
                <div className="bg-green-500 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30">
                    <CheckCircle2 className="text-white" size={56} strokeWidth={3} />
                </div>
                <p className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">Payment Successful</p>
                <h3 className={`font-black text-6xl italic tracking-tighter mb-10 ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>₱13.00</h3>
                <div className={`p-8 rounded-[2.5rem] text-left space-y-4 border-2 ${accessibility.highContrast ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-center text-[0.7rem] font-bold text-slate-400">
                        <span className="uppercase tracking-widest">TRANSACTION ID</span>
                        <span className="text-slate-800 font-black italic">#8829-102</span>
                    </div>
                    <div className="flex justify-between items-center text-[0.7rem] font-bold text-slate-400">
                        <span className="uppercase tracking-widest">UNIT</span>
                        <span className="text-slate-800 font-black italic">SIA 506</span>
                    </div>
                </div>
                <p className="text-[0.65rem] font-black text-green-600 uppercase tracking-[0.4em] mt-10 italic animate-pulse">"ipakita po sa conductor"</p>
            </div>
        </div>
    );

    const renderManualEntryOverlay = () => (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowManualEntry(false)}></div>
            <div className={`w-full max-w-[380px] rounded-[3.5rem] p-10 relative z-10 border-4 transition-colors ${accessibility.highContrast ? 'bg-slate-900 border-blue-500 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-2xl'}`}>
                <button onClick={() => setShowManualEntry(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600"><X size={32} /></button>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Manual Entry</h3>
                <p className="text-slate-400 text-[0.7rem] font-black uppercase tracking-widest mb-10 italic">Enter Fare Amount (PHP)</p>

                <div className={`p-6 rounded-[2rem] border-2 text-center mb-8 ${accessibility.highContrast ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                    <span className="text-4xl font-black tracking-tighter italic">₱ {manualAmount || '0.00'}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DEL'].map(val => (
                        <button
                            key={val}
                            onClick={() => {
                                if (val === 'DEL') setManualAmount(prev => prev.slice(0, -1));
                                else if (val === '.' && manualAmount.includes('.')) return;
                                else setManualAmount(prev => prev + val);
                            }}
                            className={`h-16 rounded-2xl font-black text-xl flex items-center justify-center transition-all active:scale-90 ${accessibility.highContrast ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white' : 'bg-white border-2 border-slate-100 shadow-sm text-slate-800'}`}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleManualCollect}
                    className="w-full py-6 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-[0.4em] text-[0.8rem] shadow-xl shadow-blue-500/30 active:translate-y-1 active:shadow-none transition-all"
                >
                    Confirm Collection
                </button>
            </div>
        </div>
    );

    const renderReportDetailsOverlay = () => (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowReportDetails(false)}></div>
            <div className={`w-full max-w-[380px] rounded-[4rem] p-12 relative z-10 border-4 transition-colors ${accessibility.highContrast ? 'bg-slate-900 border-indigo-500' : 'bg-white border-white shadow-2xl'}`}>
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className={`text-3xl font-black italic tracking-tighter uppercase leading-none ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>{selectedReport.id}</h3>
                        <p className="text-slate-400 text-[0.7rem] font-black uppercase tracking-widest mt-2 italic leading-none">Full Report Details</p>
                    </div>
                    <button onClick={() => setShowReportDetails(false)} className="p-3 bg-red-50 text-red-500 rounded-2xl"><X size={24} strokeWidth={3} /></button>
                </div>

                <div className="space-y-6 mb-10">
                    <div className={`p-6 rounded-[2.5rem] border-2 ${accessibility.highContrast ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Earnings Breakdown</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[0.75rem] font-bold text-slate-600 italic">Total Collected</span>
                            <span className="font-black text-xl italic text-green-600">₱{selectedReport.earnings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[0.75rem] font-bold text-slate-600 italic">Commission</span>
                            <span className="font-black text-xl italic text-slate-400">₱370.00</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-6 rounded-[2.5rem] border-2 text-center ${accessibility.highContrast ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50 shadow-sm'}`}>
                            <p className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Regular</p>
                            <p className="text-2xl font-black italic text-blue-600 leading-none">72</p>
                        </div>
                        <div className={`p-6 rounded-[2.5rem] border-2 text-center ${accessibility.highContrast ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50 shadow-sm'}`}>
                            <p className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Discount</p>
                            <p className="text-2xl font-black italic text-teal-600 leading-none">18</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setShowReportDetails(false)}
                    className="w-full py-6 rounded-[2rem] border-b-[8px] bg-indigo-600 border-indigo-800 text-white font-black uppercase tracking-[0.4em] text-[0.8rem] transition-all active:translate-y-2 active:border-b-4"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );

    const renderProfile = () => {
        if (profileView === 'employee-info') {
            return (
                <div className="px-6 space-y-6 animate-in slide-in-from-right-10 duration-500 text-left relative z-10">
                    <button onClick={() => setProfileView('main')} className="flex items-center space-x-2 text-slate-400 hover:text-blue-500 mb-6 group transition-colors px-2">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[0.7rem]">Back to Profile</span>
                    </button>
                    <h2 className={`text-4xl px-2 font-black mb-10 uppercase tracking-tighter italic ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>Employee Info</h2>
                    <div className={`p-8 rounded-[3.5rem] border-2 space-y-8 ${accessibility.highContrast ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-white shadow-2xl'}`}>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <span className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">Employee ID</span>
                            <span className="font-black italic text-slate-800">#CS-2024-001</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <span className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">Active License</span>
                            <span className="font-black italic text-green-600">VALID</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">Base Terminal</span>
                            <span className="font-black italic text-slate-800">Cubao Central</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (profileView === 'accessibility') {
            return (
                <div className="px-6 space-y-6 animate-in slide-in-from-right-10 duration-500 text-left relative z-10">
                    <button onClick={() => setProfileView('main')} className="flex items-center space-x-2 text-slate-400 hover:text-blue-500 mb-6 group transition-colors px-2">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[0.7rem]">Back to Profile</span>
                    </button>
                    <h2 className={`text-4xl px-2 font-black mb-10 uppercase tracking-tighter italic ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>Accessibility</h2>
                    <div className="space-y-4">
                        <button onClick={() => toggleSetting('highContrast')} className={`w-full flex items-center justify-between p-8 rounded-[3.5rem] border-2 transition-all ${accessibility.highContrast ? 'bg-indigo-600 text-white border-indigo-700 shadow-xl' : 'bg-white/80 backdrop-blur-md border-white text-slate-700 shadow-lg shadow-indigo-500/5'}`}>
                            <div className="flex items-center space-x-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accessibility.highContrast ? 'bg-white/20' : 'bg-indigo-50 shadow-sm'}`}>
                                    {accessibility.highContrast ? <Sun size={28} /> : <Moon size={28} className="text-indigo-600" />}
                                </div>
                                <div className="text-left">
                                    <span className="font-black uppercase tracking-widest text-[0.85rem] block leading-none mb-1.5">High Contrast</span>
                                    <span className={`text-[0.65rem] font-bold tracking-[0.2em] ${accessibility.highContrast ? 'text-indigo-200' : 'text-slate-400'}`}>{accessibility.highContrast ? 'ENABLED' : 'DISABLED'}</span>
                                </div>
                            </div>
                            <div className={`w-14 h-8 rounded-full p-1 transition-colors ${accessibility.highContrast ? 'bg-indigo-400' : 'bg-slate-200'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </button>

                        <button onClick={() => toggleSetting('largeText')} className={`w-full flex items-center justify-between p-8 rounded-[3.5rem] border-2 transition-all ${accessibility.largeText ? 'bg-blue-600 text-white border-blue-700 shadow-xl' : 'bg-white/80 backdrop-blur-md border-white text-slate-700 shadow-lg shadow-blue-500/5'}`}>
                            <div className="flex items-center space-x-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accessibility.largeText ? 'bg-white/20' : 'bg-blue-50 shadow-sm'}`}>
                                    <Eye size={28} className={accessibility.largeText ? 'text-white' : 'text-blue-600'} />
                                </div>
                                <div className="text-left">
                                    <span className="font-black uppercase tracking-widest text-[0.85rem] block leading-none mb-1.5 text-xl">Large Text</span>
                                    <span className={`text-[0.65rem] font-bold tracking-[0.2em] ${accessibility.largeText ? 'text-blue-200' : 'text-slate-400'}`}>{accessibility.largeText ? 'ENABLED' : 'DISABLED'}</span>
                                </div>
                            </div>
                            <div className={`w-14 h-8 rounded-full p-1 transition-colors ${accessibility.largeText ? 'bg-blue-400' : 'bg-slate-200'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${accessibility.largeText ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="px-6 space-y-12 animate-in slide-in-from-bottom-5 duration-500 text-center relative z-10 pb-6">
                <div className="relative inline-block mt-4">
                    <div className={`w-40 h-40 rounded-[4rem] p-1.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] mx-auto overflow-hidden border-2 transition-colors ${accessibility.highContrast ? 'bg-indigo-400 border-indigo-300' : 'bg-white border-white font-black'}`}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ConductorJoe" alt="Profile" className="w-full h-full object-cover rounded-[3.5rem]" />
                    </div>
                    <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 border-[6px] border-white rounded-full shadow-2xl"></div>
                </div>
                <div>
                    <h2 className={`text-5xl font-black tracking-tighter uppercase italic leading-none ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>Conductor Joe</h2>
                    <p className="text-blue-600 font-black text-[0.8rem] uppercase tracking-[0.5em] mt-4 italic">Unit SIA 506 • Silver Staff</p>
                </div>
                <div className="space-y-4 text-left">
                    {[
                        { icon: User, label: 'Employee Information', view: 'employee-info' },
                        { icon: ShieldCheck, label: 'Access Logs & Security' },
                        { icon: Settings, label: 'Settings & Accessibility', view: 'accessibility' }
                    ].map((item, i) => (
                        <button key={i} onClick={() => item.view && setProfileView(item.view)} className={`w-full flex items-center justify-between p-8 rounded-[3rem] border-2 transition-all active:scale-[0.97] group shadow-xl ${accessibility.highContrast ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/90 backdrop-blur-md border-white text-slate-700 shadow-blue-500/5'}`}>
                            <div className="flex items-center space-x-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${accessibility.highContrast ? 'bg-slate-800 text-indigo-400' : 'bg-slate-50 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 hover:rotate-12'}`}>
                                    <item.icon size={26} />
                                </div>
                                <span className={`font-black uppercase tracking-widest text-[0.85rem] ${accessibility.largeText ? 'text-xl' : ''}`}>{item.label}</span>
                            </div>
                            <ChevronRight size={22} className="text-slate-200 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
                        </button>
                    ))}
                    <button onClick={handleLogout} className="w-full bg-red-600 border-b-[10px] border-red-800 text-white p-8 rounded-[3rem] font-black uppercase tracking-[0.4em] text-[0.85rem] flex items-center justify-center space-x-5 active:translate-y-2 active:border-b-4 transition-all mt-10 shadow-2xl shadow-red-200/50">
                        <LogOut size={24} strokeWidth={4} />
                        <span>Sign Out Panel</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen relative overflow-hidden flex flex-col items-center transition-colors duration-500 ${accessibility.highContrast ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Map Background Layer (Fixed & Blurred) */}
            <div className="absolute inset-0 z-0 opacity-20 filter grayscale contrast-125">
                <RouteMap />
                <div className={`absolute inset-0 ${accessibility.highContrast ? 'bg-slate-950/60' : 'bg-white/40'}`}></div>
            </div>

            <div className={`w-full max-w-[480px] h-full relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.4)] transition-all overflow-hidden ${accessibility.highContrast ? 'bg-slate-900/40 backdrop-blur-3xl' : 'bg-white/10'}`}>

                <div className="flex-1 overflow-y-auto pb-36 scrollbar-hide relative">
                    {renderHeader()}

                    {bottomNav === 'Reports' && (
                        <>
                            {renderTabs()}
                            <div className="mt-4">
                                {activeTab === 'Fare Reports' && renderFareReports()}
                                {activeTab === 'Fare Collection' && renderFareCollection()}
                                {activeTab === 'E-Receipt' && renderEReceiptView()}
                            </div>
                        </>
                    )}

                    {bottomNav === 'Fare' && (
                        <div className="px-6 space-y-8 pt-10 relative z-10 animate-in slide-in-from-bottom-5 duration-500 pb-6">
                            <h2 className={`text-5xl px-2 font-black italic uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>Live Collection</h2>
                            <div className={`p-12 rounded-[4rem] text-center shadow-2xl relative overflow-hidden group border-b-[12px] active:scale-[0.98] transition-all ${accessibility.highContrast ? 'bg-slate-900 border-indigo-600 shadow-indigo-500/10' : 'bg-[#1E1E2E] text-white border-blue-900 shadow-blue-900/30'}`}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                                <div className="relative z-10">
                                    <p className="text-blue-400 text-[0.75rem] font-black uppercase tracking-[0.5em] mb-4 italic">Today's Earnings</p>
                                    <h3 className={`font-black italic tracking-tighter ${accessibility.largeText ? 'text-7xl' : 'text-6xl'}`}>₱{collectedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                                    <div className="mt-12 pt-10 border-t border-white/10 flex justify-around">
                                        <div>
                                            <p className="text-[0.6rem] font-bold text-slate-500 mb-2 uppercase tracking-widest">Total Hits</p>
                                            <p className="text-3xl font-black italic text-blue-400 leading-none">142</p>
                                        </div>
                                        <div className="w-px h-12 bg-white/10 scale-y-125"></div>
                                        <div>
                                            <p className="text-[0.6rem] font-bold text-slate-500 mb-2 uppercase tracking-widest">Target</p>
                                            <p className="text-3xl font-black italic text-white leading-none">85%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 px-2">
                                <h3 className={`font-black text-[0.7rem] uppercase tracking-[0.4em] italic ${accessibility.highContrast ? 'text-indigo-400' : 'text-slate-400'}`}>Recent Transactions</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`p-8 rounded-[3rem] border-2 shadow-sm flex justify-between items-center transition-all active:scale-[0.98] ${accessibility.highContrast ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-white shadow-lg shadow-blue-500/5'}`}>
                                            <div className="flex items-center space-x-5">
                                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner"><Receipt size={26} /></div>
                                                <div>
                                                    <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1.5 leading-none">Success • {7 + i}:45 PM</p>
                                                    <h4 className={`font-black italic text-xl uppercase tracking-tighter leading-none ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>Regular Fare</h4>
                                                </div>
                                            </div>
                                            <span className={`font-black text-2xl italic ${accessibility.highContrast ? 'text-indigo-400' : 'text-slate-900'}`}>₱13.00</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {bottomNav === 'Profile' && (
                        <div className="pt-10">
                            {renderProfile()}
                        </div>
                    )}
                </div>

                {/* Overlays */}
                {showManualEntry && renderManualEntryOverlay()}
                {showReportDetails && renderReportDetailsOverlay()}

                {/* BOTTOM NAVIGATION */}
                <div className={`absolute bottom-0 left-0 right-0 z-40 border-t-2 transition-colors ${accessibility.highContrast ? 'bg-slate-900/80 backdrop-blur-2xl border-slate-800' : 'bg-white/80 backdrop-blur-2xl border-white shadow-[0_-20px_50px_rgba(0,0,0,0.08)]'}`}>
                    <div className="flex justify-around py-6 pb-12 px-10">
                        {[
                            { id: 'Reports', icon: Mail, label: 'Reports' },
                            { id: 'Fare', icon: List, label: 'Fare' },
                            { id: 'Profile', icon: User, label: 'Profile' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setBottomNav(tab.id)}
                                className={`flex flex-col items-center space-y-1.5 transition-all active:scale-90 ${bottomNav === tab.id ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
                            >
                                <tab.icon size={28} strokeWidth={bottomNav === tab.id ? 4 : 2} />
                                <span className={`text-[0.6rem] font-black uppercase tracking-[0.2em] ${accessibility.largeText ? 'text-[0.75rem]' : ''} ${bottomNav === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* FeedBack Syncing Toast */}
                {isCollecting && (
                    <div className="absolute bottom-36 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-none">
                        <div className="bg-blue-600 rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-between text-white border-b-[8px] border-blue-800 max-w-sm mx-auto overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                            <div className="flex items-center space-x-5 relative z-10">
                                <div className="bg-white/20 p-3 rounded-full animate-bounce">
                                    <CheckCircle2 size={24} strokeWidth={4} />
                                </div>
                                <div>
                                    <p className="font-black text-sm uppercase tracking-[0.2em] italic leading-none">Syncing Fare...</p>
                                    <p className="text-[0.65rem] font-bold opacity-70 mt-1.5">Data sent to terminal logs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
