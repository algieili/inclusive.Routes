import React from 'react';
import { User, Settings, HelpCircle, LogOut, Heart, Eye, ChevronRight, ShieldCheck, Volume2, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, logout, accessibility, updateAccessibility } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSetting = (key) => {
        updateAccessibility({ [key]: !accessibility[key] });
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${accessibility.highContrast ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} relative pb-32`}>
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 right-0 h-48 ${accessibility.highContrast ? 'bg-indigo-900/20' : 'bg-indigo-600/10'} rounded-b-[4rem]`}></div>

            <div className="max-w-md mx-auto p-6 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10 pt-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-2xl shadow-xl ${accessibility.highContrast ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-white'}`}>
                            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                            Inclusive<span className="text-red-500">.Route</span>
                        </h1>
                    </div>
                </div>

                {/* Profile Card */}
                <div className={`${accessibility.highContrast ? 'bg-slate-900 border-2 border-indigo-500' : 'bg-white shadow-2xl'} rounded-[3rem] p-8 mb-10 text-center relative overflow-hidden group`}>
                    <div className={`absolute -top-12 -right-12 w-48 h-48 ${accessibility.highContrast ? 'bg-indigo-500/10' : 'bg-indigo-50'} rounded-full blur-3xl transition-transform group-hover:scale-125`}></div>

                    <div className="relative">
                        <div className="w-28 h-28 mx-auto mb-6 p-1 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-[2.5rem] shadow-xl">
                            <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden border-4 border-white">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Morales'}&clothing=graphicShirt&top=longHairBun`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h2 className={`text-2xl font-black tracking-tight mb-1 ${accessibility.highContrast ? 'text-white' : 'text-slate-900'}`}>{user?.username || 'Morales, John Algie'}</h2>
                        <p className={`text-xs font-bold uppercase tracking-[0.3em] ${accessibility.highContrast ? 'text-indigo-400' : 'text-slate-400'}`}>Verified {user?.role || 'Passenger'}</p>
                    </div>
                </div>

                {/* Accessibility Suite */}
                <div className="mb-10 space-y-4">
                    <h3 className={`px-4 text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4 ${accessibility.highContrast ? 'text-slate-500' : 'text-slate-400'}`}>Inclusive Controls</h3>

                    {/* High Contrast Toggle */}
                    <button
                        onClick={() => toggleSetting('highContrast')}
                        className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] transition-all active:scale-[0.98] ${accessibility.highContrast ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-700 shadow-md border border-slate-100'}`}
                    >
                        <div className="flex items-center space-x-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accessibility.highContrast ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                                {accessibility.highContrast ? <Sun size={28} /> : <Moon size={28} />}
                            </div>
                            <div className="text-left">
                                <span className="font-black text-lg tracking-tight block leading-none mb-1">High Contrast Mode</span>
                                <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${accessibility.highContrast ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {accessibility.highContrast ? 'ENABLED' : 'DISABLED'}
                                </span>
                            </div>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${accessibility.highContrast ? 'bg-indigo-400' : 'bg-slate-200'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </button>

                    {/* Large Text Toggle */}
                    <button
                        onClick={() => toggleSetting('largeText')}
                        className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] transition-all active:scale-[0.98] ${accessibility.largeText ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white text-slate-700 shadow-md border border-slate-100'}`}
                    >
                        <div className="flex items-center space-x-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accessibility.largeText ? 'bg-white/20' : 'bg-cyan-50 text-cyan-600'}`}>
                                <Eye size={28} />
                            </div>
                            <div className="text-left">
                                <span className="font-black text-lg tracking-tight block leading-none mb-1 text-xl">Large Text Mode</span>
                                <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${accessibility.largeText ? 'text-cyan-200' : 'text-slate-400'}`}>
                                    {accessibility.largeText ? 'ENABLED' : 'DISABLED'}
                                </span>
                            </div>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${accessibility.largeText ? 'bg-cyan-400' : 'bg-slate-200'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${accessibility.largeText ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </button>

                    {/* Voice Guidance Toggle */}
                    <button
                        onClick={() => toggleSetting('voiceGuidance')}
                        className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] transition-all active:scale-[0.98] ${accessibility.voiceGuidance ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-700 shadow-md border border-slate-100'}`}
                    >
                        <div className="flex items-center space-x-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accessibility.voiceGuidance ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                                <Volume2 size={28} />
                            </div>
                            <div className="text-left">
                                <span className="font-black text-lg tracking-tight block leading-none mb-1">Voice Optimizer</span>
                                <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${accessibility.voiceGuidance ? 'text-emerald-200' : 'text-slate-400'}`}>
                                    {accessibility.voiceGuidance ? 'ACTIVE' : 'OFF'}
                                </span>
                            </div>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${accessibility.voiceGuidance ? 'bg-emerald-400' : 'bg-slate-200'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${accessibility.voiceGuidance ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </button>
                </div>

                {/* Secondary Menu */}
                <div className="space-y-3 mb-12">
                    <button className={`w-full flex items-center justify-between p-5 rounded-[2rem] group transition-all ${accessibility.highContrast ? 'hover:bg-slate-900 border border-slate-800' : 'hover:bg-white border border-transparent'}`}>
                        <div className="flex items-center space-x-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accessibility.highContrast ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                <HelpCircle size={20} />
                            </div>
                            <span className="font-black text-sm uppercase tracking-widest italic tracking-tight">Help & Support</span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Log Out Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-red-200 transition-all active:scale-95 uppercase tracking-[0.3em] text-xs flex items-center justify-center space-x-4"
                >
                    <LogOut size={20} />
                    <span>Secure Sign Out</span>
                </button>

                <p className={`mt-10 text-center text-[0.6rem] font-black uppercase tracking-[0.4em] ${accessibility.highContrast ? 'text-slate-600' : 'text-slate-300'}`}>
                    Inclusive.Route v1.0.4
                </p>
            </div>
        </div>
    );
}
