
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronRight, User, Bus, Search, Bell, MapPin, Activity, Home, BarChart3, Settings, LogOut, ShieldCheck, Sun, Moon, Eye, Volume2, ArrowLeft, Heart, List, Mail, CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RouteMap from '../components/Shared/RouteMap';

export default function OperatorDashboard() {
    const navigate = useNavigate();
    const { logout, accessibility, updateAccessibility } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');
    const [profileView, setProfileView] = useState('main');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUnitDetails, setShowUnitDetails] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const toggleSetting = (key) => {
        updateAccessibility({ [key]: !accessibility[key] });
    };

    // Mock Data for Units
    const units = [
        { id: 'SIA 506', plate: 'PUJ-1234', driver: 'Eduardo Ramirez', status: 'Online', earnings: '50 120.00', fuel: '85%', speed: '32 km/h' },
        { id: 'SIA 507', plate: 'PUJ-1235', driver: 'Maria Santos', status: 'Offline', earnings: '99 720.00', fuel: '40%', speed: '0 km/h' },
        { id: 'SIA 508', plate: 'PUJ-1236', driver: 'Juan Dela Cruz', status: 'Online', earnings: '97 720.00', fuel: '92%', speed: '28 km/h' },
        { id: 'SIA 509', plate: 'PUJ-1237', driver: 'Pedro Penduko', status: 'Offline', earnings: '99 730.00', fuel: '10%', speed: '0 km/h' },
    ];

    const notifications = [
        { id: 1, type: 'alert', message: 'Unit SIA 509: Critical Fuel Level (10%)', time: '2 mins ago' },
        { id: 2, type: 'info', message: 'Daily revenue target reached (92%)', time: '1 hour ago' },
        { id: 3, type: 'sync', message: 'System sync completed successfully', time: '3 hours ago' },
    ];

    const renderHeader = () => (
        <div className={`p-8 pb-4 pt-10 flex flex-col space-y-4 relative z-10 transition-all ${accessibility.highContrast ? 'bg-slate-900/80 backdrop-blur-md' : 'bg-white/40 backdrop-blur-md'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className={`text-3xl font-black italic tracking-tighter uppercase leading-tight drop-shadow-sm ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>
                        Hello, <br />
                        <span className="text-blue-600">Operator Morales!</span>
                    </h1>
                </div>
                <button
                    onClick={() => setActiveTab('Profile')}
                    className="relative group focus:outline-none"
                >
                    <div className={`w-20 h-20 rounded-[2rem] p-1.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-4 transition-all group-hover:scale-105 active:scale-95 ${accessibility.highContrast ? 'bg-indigo-400 border-indigo-300' : 'bg-slate-950 border-white'}`}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=OperatorMax" alt="Profile" className="w-full h-full object-cover rounded-[1.5rem]" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
                </button>
            </div>
        </div>
    );

    const renderChart = () => (
        <div className="h-28 w-full mt-10 relative">
            <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-[0_10px_10px_rgba(245,158,11,0.2)]" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,32 C10,30 15,35 25,28 C35,21 40,24 50,14 C60,4 65,11 75,7 C85,3 90,9 100,2"
                    fill="none"
                    stroke={accessibility.highContrast ? '#fbbf24' : '#f59e0b'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M0,32 C10,30 15,35 25,28 C35,21 40,24 50,14 C60,4 65,11 75,7 C85,3 90,9 100,2 V40 H0 Z"
                    fill="url(#chartGradient)"
                />
            </svg>
            <div className={`flex justify-between mt-4 px-2 text-[0.5rem] font-black uppercase tracking-[0.3em] ${accessibility.highContrast ? 'text-slate-400' : 'text-slate-400'}`}>
                <span>Today</span>
                <span>15.am</span>
                <span>5 pm</span>
                <span>2 am</span>
                <span>5 am</span>
            </div>
        </div>
    );

    const renderOverview = () => (
        <div className="px-6 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-10 relative z-10 mt-4">
            {/* Main Overview Card */}
            <div className={`rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-b-[12px] transition-all group overflow-hidden ${accessibility.highContrast ? 'bg-slate-900 border-indigo-600' : 'bg-white border-blue-50'}`}>
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <h3 className={`font-black text-2xl italic uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>Overview</h3>
                    <button
                        onClick={() => navigate('/analytics')}
                        className="flex items-center space-x-3 bg-blue-50/80 backdrop-blur-sm py-2 px-6 rounded-2xl shadow-inner border border-blue-100 hover:scale-105 active:scale-95 transition-all"
                    >
                        <BarChart3 size={20} className="text-blue-500" />
                        <span className="font-black text-blue-600 text-xl italic leading-none">50</span>
                        <TrendingUp size={18} className="text-green-500" />
                    </button>
                </div>

                <div className="relative z-10">
                    <p className={`font-black text-[0.75rem] uppercase tracking-[0.5em] mb-3 italic ${accessibility.highContrast ? 'text-indigo-400' : 'text-slate-400'}`}>Today's Earnings</p>
                    <p className={`font-black tracking-tighter italic leading-none ${accessibility.largeText ? 'text-6xl' : 'text-5xl'} ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>
                        Php <span className="text-5xl">9,200.00</span>
                    </p>
                </div>

                {renderChart()}
            </div>

            {/* Unit Monitoring Section */}
            <div className="space-y-6 pb-6">
                <div className="flex justify-between items-center px-4">
                    <h4 className={`text-2xl font-black italic uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>Unit Monitoring</h4>
                    <button className="p-3 bg-white/50 backdrop-blur-md rounded-2xl text-slate-300 hover:text-blue-600"><Search size={24} /></button>
                </div>

                <div className="space-y-5">
                    {units.map((unit, i) => (
                        <button
                            key={i}
                            onClick={() => { setSelectedUnit(unit); setShowUnitDetails(true); }}
                            className={`w-full p-8 rounded-[3.5rem] border-2 shadow-xl flex items-center justify-between group transition-all active:scale-[0.97] backdrop-blur-md text-left ${accessibility.highContrast ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-white shadow-blue-500/5'}`}
                        >
                            <div className="flex items-center space-x-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-6 group-hover:scale-110 ${accessibility.highContrast ? 'bg-slate-800' : 'bg-slate-50 shadow-inner'}`}>
                                    <span className="text-4xl">🚌</span>
                                </div>
                                <div className="text-left">
                                    <h5 className={`font-black italic text-xl leading-none mb-1.5 uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>{unit.id}</h5>
                                    <p className="text-slate-400 text-[0.7rem] font-black uppercase tracking-[0.2em] leading-none mb-1.5">{unit.plate}</p>
                                    <p className="text-slate-400 text-[0.6rem] font-bold italic leading-none">{unit.driver}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center justify-end space-x-2.5 mb-3">
                                    <div className={`w-3.5 h-3.5 rounded-full animate-pulse ${unit.status === 'Online' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]'}`}></div>
                                    <span className={`text-[0.75rem] font-black uppercase tracking-widest ${unit.status === 'Online' ? 'text-green-600' : 'text-orange-600'}`}>{unit.status}</span>
                                </div>
                                <p className={`font-black italic tracking-tighter ${accessibility.largeText ? 'text-xl' : 'text-lg'} ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>{unit.earnings}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFleet = () => (
        <div className="px-6 space-y-8 animate-in slide-in-from-right-10 duration-500 pb-10 pt-4 relative z-10 mt-6">
            <h2 className={`text-5xl px-2 font-black italic uppercase tracking-tighter ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>My Fleet</h2>
            <div className="grid grid-cols-2 gap-6">
                <button className={`p-10 rounded-[3.5rem] border-b-[8px] flex flex-col items-center justify-center text-center shadow-2xl transition-all active:scale-95 ${accessibility.highContrast ? 'bg-slate-900 border-indigo-600' : 'bg-indigo-600 text-white border-indigo-800 shadow-indigo-500/30'}`}>
                    <Bus size={40} className="mb-4" />
                    <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] mb-2 opacity-70 italic">Active Units</p>
                    <p className="text-4xl font-black italic tracking-tighter">12 / 15</p>
                </button>
                <button className={`p-10 rounded-[3.5rem] border-b-[8px] flex flex-col items-center justify-center text-center shadow-2xl transition-all active:scale-95 ${accessibility.highContrast ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 shadow-lg shadow-indigo-500/5'}`}>
                    <TrendingUp size={40} className="mb-4 text-indigo-600" />
                    <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] mb-2 text-slate-400 italic">Efficiency</p>
                    <p className="text-4xl font-black italic text-indigo-600 tracking-tighter">92%</p>
                </button>
            </div>

            <div className="space-y-6 px-2">
                <h3 className={`font-black text-[0.8rem] uppercase tracking-[0.5em] italic ${accessibility.highContrast ? 'text-indigo-400' : 'text-slate-400'}`}>Performance Logs</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`p-8 rounded-[3rem] border-2 shadow-xl flex items-center justify-between transition-all active:scale-[0.98] ${accessibility.highContrast ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-white shadow-indigo-500/5'}`}>
                            <div className="flex items-center space-x-5">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner"><Activity size={28} /></div>
                                <div>
                                    <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] italic leading-none mb-2">Log ID #88-{i}</p>
                                    <h4 className={`font-black italic text-xl uppercase tracking-tighter leading-none ${accessibility.highContrast ? 'text-white' : 'text-slate-800'}`}>System Sync</h4>
                                </div>
                            </div>
                            <div className="bg-green-100 p-2.5 rounded-full"><CheckCircle2 size={24} className="text-green-600" strokeWidth={3} /></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderNotificationsOverlay = () => (
        <div className="absolute inset-0 z-[100] flex items-end justify-center animate-in slide-in-from-bottom-10 duration-500">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowNotifications(false)}></div>
            <div className={`w-full max-w-[480px] rounded-t-[4rem] p-10 pb-20 relative z-10 border-t-8 transition-colors ${accessibility.highContrast ? 'bg-slate-900 border-indigo-600' : 'bg-white border-blue-500 shadow-[0_-50px_100px_rgba(0,0,0,0.2)]'}`}>
                <div className="w-20 h-2 bg-slate-200 rounded-full mx-auto mb-10"></div>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-800"><X size={24} strokeWidth={3} /></button>
                </div>
                <div className="space-y-4">
                    {notifications.map(n => (
                        <div key={n.id} className="p-6 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 flex items-start space-x-5 group hover:bg-white hover:shadow-xl transition-all">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                {n.type === 'alert' ? <AlertTriangle size={26} /> : <Info size={26} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-900 font-black italic tracking-tight leading-tight">{n.message}</p>
                                <p className="text-slate-400 text-[0.6rem] font-black uppercase tracking-widest mt-2">{n.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full py-6 mt-10 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-[0.4em] text-[0.75rem] shadow-xl shadow-blue-500/30">Clear All Alerts</button>
            </div>
        </div>
    );

    const renderUnitDetailsOverlay = () => (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowUnitDetails(false)}></div>
            <div className={`w-full max-w-[400px] rounded-[4rem] p-12 relative z-10 border-4 transition-colors ${accessibility.highContrast ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-white border-white shadow-2xl text-slate-900'}`}>
                <button onClick={() => setShowUnitDetails(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500 transition-colors"><X size={32} /></button>
                <div className="text-center mb-10">
                    <div className="w-28 h-28 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/10">
                        <span className="text-6xl">🚌</span>
                    </div>
                    <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{selectedUnit.id}</h3>
                    <p className="text-slate-400 text-[0.75rem] font-black uppercase tracking-[0.4em] mt-3 italic mb-2 tracking-widest">{selectedUnit.plate}</p>
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-widest leading-none">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        <span>LIVE GPS ACTIVE</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-6 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 text-center">
                        <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Fuel Level</p>
                        <p className="text-2xl font-black italic text-slate-900">{selectedUnit.fuel}</p>
                    </div>
                    <div className="p-6 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 text-center">
                        <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Avg Speed</p>
                        <p className="text-2xl font-black italic text-slate-900">{selectedUnit.speed}</p>
                    </div>
                </div>

                <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl mb-4 text-center">
                    <p className="text-white/60 text-[0.65rem] font-black uppercase tracking-widest mb-2 italic">Driver on Duty</p>
                    <p className="text-2xl font-black italic tracking-tight">{selectedUnit.driver}</p>
                </div>
            </div>
        </div>
    );

    const renderProfile = () => {
        if (profileView === 'operator-credentials') {
            return (
                <div className="px-6 space-y-6 animate-in slide-in-from-right-10 duration-500 text-left relative z-10">
                    <button onClick={() => setProfileView('main')} className="flex items-center space-x-2 text-slate-400 hover:text-indigo-500 mb-6 group transition-colors px-2">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[0.7rem]">Back to Profile</span>
                    </button>
                    <h2 className={`text-4xl px-2 font-black mb-10 uppercase tracking-tighter italic ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>Office Info</h2>
                    <div className={`p-8 rounded-[3.5rem] border-2 space-y-8 ${accessibility.highContrast ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-white shadow-2xl'}`}>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <span className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">Office ID</span>
                            <span className="font-black italic text-slate-800">#OFF-MORALES-01</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <span className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">Fleet Size</span>
                            <span className="font-black italic text-indigo-600">15 UNITS</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest">Region Office</span>
                            <span className="font-black italic text-slate-800">Quezon City</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (profileView === 'accessibility') {
            return (
                <div className="px-6 space-y-6 animate-in slide-in-from-right-10 duration-500 text-left relative z-10">
                    <button onClick={() => setProfileView('main')} className="flex items-center space-x-2 text-slate-400 hover:text-indigo-500 mb-6 group transition-colors px-2">
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
            <div className="px-6 space-y-12 animate-in slide-in-from-bottom-5 duration-500 text-center relative z-10 mt-6 pb-6">
                <div className="relative inline-block">
                    <div className={`w-44 h-44 rounded-[4rem] p-1.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] mx-auto overflow-hidden border-4 transition-colors ${accessibility.highContrast ? 'bg-indigo-400 border-indigo-300' : 'bg-slate-950 border-white font-black'}`}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=OperatorMax" alt="Profile" className="w-full h-full object-cover rounded-[3.5rem]" />
                    </div>
                    <div className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 border-[6px] border-white rounded-full shadow-2xl"></div>
                </div>
                <div>
                    <h2 className={`text-5xl font-black tracking-tighter uppercase italic leading-none ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>Max Morales</h2>
                    <p className="text-indigo-600 font-black text-[0.85rem] uppercase tracking-[0.5em] mt-5 italic">Fleet Manager • Morales Transport</p>
                </div>
                <div className="space-y-4 text-left">
                    {[
                        { icon: User, label: 'Operator Credentials', view: 'operator-credentials' },
                        { icon: ShieldCheck, label: 'Privacy & Security' },
                        { icon: Settings, label: 'Accessibility Settings', view: 'accessibility' }
                    ].map((item, i) => (
                        <button key={i} onClick={() => item.view && setProfileView(item.view)} className={`w-full flex items-center justify-between p-8 rounded-[3rem] border-2 transition-all active:scale-[0.97] group shadow-xl ${accessibility.highContrast ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/90 backdrop-blur-md border-white text-slate-700 shadow-indigo-500/5'}`}>
                            <div className="flex items-center space-x-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${accessibility.highContrast ? 'bg-slate-800 text-indigo-400' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 hover:rotate-12'}`}>
                                    <item.icon size={26} />
                                </div>
                                <span className={`font-black uppercase tracking-widest text-[0.85rem] ${accessibility.largeText ? 'text-xl' : ''}`}>{item.label}</span>
                            </div>
                            <ChevronRight size={22} className="text-slate-200 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                        </button>
                    ))}
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full bg-red-600 border-b-[12px] border-red-800 text-white p-8 rounded-[3.5rem] font-black uppercase tracking-[0.4em] text-[0.9rem] flex items-center justify-center space-x-5 active:translate-y-2 active:border-b-4 transition-all mt-10 shadow-2xl shadow-red-200/50">
                        <LogOut size={26} strokeWidth={4} />
                        <span>Sign Out Fleet</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen relative overflow-hidden flex flex-col items-center transition-colors duration-500 ${accessibility.highContrast ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Map Background Layer */}
            <div className="absolute inset-0 z-0 opacity-20 filter grayscale contrast-125">
                <RouteMap />
                <div className={`absolute inset-0 ${accessibility.highContrast ? 'bg-slate-950/60' : 'bg-white/40'}`}></div>
            </div>

            <div className={`w-full max-w-[480px] h-full relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.4)] transition-all overflow-hidden ${accessibility.highContrast ? 'bg-slate-900/40 backdrop-blur-3xl' : 'bg-white/10'}`}>

                <div className="flex-1 overflow-y-auto pb-36 scrollbar-hide relative">
                    {activeTab !== 'Profile' && renderHeader()}

                    {activeTab === 'Overview' && renderOverview()}
                    {activeTab === 'Fleet' && renderFleet()}
                    {activeTab === 'Profile' && (
                        <div className="pt-10">
                            {renderProfile()}
                        </div>
                    )}
                </div>

                {/* Overlays */}
                {showNotifications && renderNotificationsOverlay()}
                {showUnitDetails && renderUnitDetailsOverlay()}

                {/* BOTTOM NAVIGATION (Standardized) */}
                <div className={`absolute bottom-0 left-0 right-0 z-40 border-t-2 transition-colors ${accessibility.highContrast ? 'bg-slate-900/80 backdrop-blur-2xl border-slate-800' : 'bg-white/80 backdrop-blur-2xl border-white shadow-[0_-20px_50px_rgba(0,0,0,0.08)]'}`}>
                    <div className="flex justify-around py-6 pb-12 px-10">
                        {[
                            { id: 'Overview', icon: Mail, label: 'Reports' },
                            { id: 'Fleet', icon: List, label: 'Fleet' },
                            { id: 'Profile', icon: User, label: 'Profile' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center space-y-1.5 transition-all active:scale-90 ${activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}
                            >
                                <tab.icon size={28} strokeWidth={activeTab === tab.id ? 4 : 2} />
                                <span className={`text-[0.6rem] font-black uppercase tracking-[0.2em] ${accessibility.largeText ? 'text-[0.75rem]' : ''} ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notification Bell */}
                {activeTab !== 'Profile' && (
                    <div className="fixed bottom-32 right-6 z-20 pointer-events-auto">
                        <button
                            onClick={() => setShowNotifications(true)}
                            className={`w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:rotate-12 active:scale-90 transition-all border-b-6 ${accessibility.highContrast ? 'bg-white text-slate-900 border-slate-300' : 'bg-indigo-600 text-white border-indigo-800'}`}
                        >
                            <Bell size={28} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
