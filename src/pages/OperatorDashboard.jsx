import React from 'react';
import { TrendingUp, ChevronRight, User, Bus, Search, Bell, MapPin, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OperatorDashboard() {
    const { accessibility } = useAuth();

    // Mock Data
    const units = [
        { id: 'SIA 506', plate: 'PUJ-1234', driver: 'Eduardo Ramirez', status: 'Online', earnings: '50,120.00', color: 'text-green-500' },
        { id: 'SIA 702', plate: 'PUJ-5678', driver: 'Marco Dela Cruz', status: 'Offline', earnings: '32,450.00', color: 'text-slate-400' },
        { id: 'SIA 201', plate: 'PUJ-9012', driver: 'Santi Rivera', status: 'Online', earnings: '48,220.00', color: 'text-blue-500' },
        { id: 'SIA 443', plate: 'PUJ-3456', driver: 'Pio Santos', status: 'Online', earnings: '12,730.00', color: 'text-green-500' },
    ];

    const isHighContrast = accessibility.highContrast;

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isHighContrast ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Background Mesh Accent */}
            <div className={`absolute top-0 right-0 w-[80%] h-[40%] ${isHighContrast ? 'bg-indigo-900/10' : 'bg-indigo-500/5'} blur-[100px] rounded-full -mr-20 -mt-20`}></div>

            <div className="max-w-md mx-auto p-6 pb-32 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 pt-4">
                    <div>
                        <p className={`text-[0.6rem] font-black uppercase tracking-[0.3em] mb-1 italic ${isHighContrast ? 'text-indigo-400' : 'text-slate-400'}`}>Fleet Control Center</p>
                        <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">
                            Hello, <span className="text-indigo-600">Morales!</span>
                        </h1>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border-4 ${isHighContrast ? 'bg-slate-900 border-slate-700' : 'bg-white border-white'} overflow-hidden`}>
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=OperatorMax"
                            alt="Operator"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Main Overview Card */}
                <div className={`rounded-[3.5rem] p-10 mb-10 relative overflow-hidden group transition-all
                    ${isHighContrast ? 'bg-slate-900 border-2 border-indigo-500 shadow-indigo-500/10' : 'bg-white shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)]'}`}>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-black text-slate-400 text-[0.6rem] uppercase tracking-[0.3em] italic mb-1">Today's Revenue</h3>
                                <p className="text-4xl font-black tracking-tighter italic">₱9,200.00</p>
                            </div>
                            <div className="bg-green-500/10 text-green-500 px-3 py-1.5 rounded-xl border border-green-500/20 flex items-center space-x-2">
                                <TrendingUp size={14} strokeWidth={3} />
                                <span className="text-[0.7rem] font-black tracking-tighter">+12%</span>
                            </div>
                        </div>

                        {/* High Fidelity Line Chart Mock */}
                        <div className="h-32 w-full mt-4 flex items-end">
                            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible drop-shadow-2xl">
                                <defs>
                                    <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,35 C10,32 15,38 25,30 C35,22 40,25 50,15 C60,5 65,12 75,8 C85,4 90,10 100,2"
                                    fill="none"
                                    stroke="#4f46e5"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M0,35 C10,32 15,38 25,30 C35,22 40,25 50,15 C60,5 65,12 75,8 C85,4 90,10 100,2 V40 H0 Z"
                                    fill="url(#chartLineGrad)"
                                />
                                {/* Pulsing Dot for Live Status */}
                                <circle cx="100" cy="2" r="3" fill="#4f46e5" />
                                <circle cx="100" cy="2" r="6" fill="#4f46e5" className="animate-ping opacity-20" />
                            </svg>
                        </div>

                        <div className="flex justify-between mt-6 px-1">
                            {['7 AM', '11 AM', '3 PM', 'LIVE'].map((time, i) => (
                                <span key={i} className={`text-[0.55rem] font-black uppercase tracking-widest ${isHighContrast ? 'text-slate-600' : 'text-slate-300'}`}>{time}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fleet Monitoring Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center space-x-3">
                            <Activity className="text-indigo-500" size={20} />
                            <h3 className="font-black text-sm uppercase tracking-widest italic tracking-tight">Active Fleet Units</h3>
                        </div>
                        <Search className="text-slate-300" size={20} />
                    </div>

                    <div className="space-y-4">
                        {units.map((unit, i) => (
                            <div key={i} className={`p-5 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all
                                ${isHighContrast ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-sm hover:shadow-xl border border-white'}`}>

                                <div className="flex items-center space-x-5">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden transition-transform group-hover:rotate-12
                                        ${isHighContrast ? 'bg-slate-800' : 'bg-indigo-50'}`}>
                                        <Bus className={`${isHighContrast ? 'text-indigo-400' : 'text-indigo-500'}`} size={32} />
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-indigo-500/10"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-base tracking-tighter leading-none mb-1 italic">{unit.id}</h4>
                                        <p className="text-slate-400 text-[0.6rem] font-bold uppercase tracking-widest leading-none mb-1">{unit.plate}</p>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${unit.color} animate-pulse`}></div>
                                            <span className={`text-[0.65rem] font-black uppercase tracking-tighter ${unit.color}`}>{unit.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end">
                                    <p className={`text-[0.55rem] font-black uppercase tracking-widest mb-1 ${isHighContrast ? 'text-slate-500' : 'text-slate-400'}`}>Earnings</p>
                                    <p className="font-black text-lg tracking-tighter italic">₱{unit.earnings}</p>
                                    <ChevronRight className="text-slate-200 mt-2" size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Action Overlay (Optional) */}
                <div className="fixed bottom-28 right-6 z-20">
                    <button className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-400/50 flex items-center justify-center hover:rotate-12 active:scale-90 transition-all border-b-4 border-indigo-800">
                        <Bell size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
}
