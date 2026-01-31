
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, Bus, ShieldCheck, Map, Settings, Heart } from 'lucide-react';

export default function MainLayout() {
    const { user, accessibility } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    // Accessibility Logic
    const highContrastClass = accessibility.highContrast ? 'bg-slate-950 contrast-125' : 'bg-slate-50';
    const largeTextClass = accessibility.largeText ? 'text-xl' : 'text-base';

    const navItems = [
        { icon: Map, label: 'Map', path: '/dashboard' },
        { icon: Heart, label: 'Favs', path: '#' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className={`flex flex-col h-screen transition-colors duration-500 ${highContrastClass} ${largeTextClass}`}>
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-32">
                <Outlet />
            </main>

            {/* Bottom Navigation (Elderly Friendly & Accessibility Aware) */}
            <nav className={`fixed bottom-0 left-0 right-0 border-t-2 pb-6 pt-2 px-2 shadow-2xl flex justify-around items-center z-50 transition-colors
                ${accessibility.highContrast ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-white border-slate-100'}`}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full py-3 rounded-[2rem] transition-all active:scale-90 touch-manipulation
                 ${isActive
                                    ? (accessibility.highContrast ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-700 bg-indigo-50 font-black scale-105')
                                    : (accessibility.highContrast ? 'text-slate-400' : 'text-slate-400 hover:bg-slate-50')}`}
                        >
                            <item.icon size={accessibility.largeText ? 36 : 30} strokeWidth={isActive ? 4 : 2} className="mb-1" />
                            <span className={`text-[0.6rem] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
                        </button>
                    )
                })}
            </nav>
        </div>
    );
}
