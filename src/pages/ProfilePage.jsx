import React from 'react';
import { User, Heart, Settings, HelpCircle, LogOut, ChevronRight, Activity, Volume2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white flex justify-center overflow-hidden">
            <div className="w-full max-w-[480px] h-full bg-white relative flex flex-col p-6 pt-12">
                {/* Logo Header */}
                <div className="flex items-center space-x-2 mb-8 px-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 border-2 border-slate-200 rounded-full flex items-center justify-center p-1">
                            <MapPin className="text-red-600 fill-current" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-800">
                            Inclusive<span className="text-slate-400">.Route</span>
                        </h1>
                    </div>
                </div>

                {/* User Name Badge */}
                <div className="bg-slate-100 rounded-[2rem] p-6 flex items-center space-x-6 mb-10 border border-slate-200/50">
                    <div className="w-20 h-20 bg-white rounded-full p-1 shadow-sm overflow-hidden flex items-center justify-center border-2 border-slate-200">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'John'}&clothing=graphicShirt&top=shortHair`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-left">
                        <h2 className="text-2xl font-bold text-slate-700 tracking-tight italic">
                            {user?.username || 'Morales, John Algie'}
                        </h2>
                    </div>
                </div>

                {/* Settings Menu List */}
                <div className="space-y-0 text-left border-t border-slate-100 flex-1">
                    {[
                        { icon: User, label: 'My Account' },
                        { icon: Heart, label: 'PWD Setting' },
                        { icon: Activity, label: 'Accessibility Settings' },
                        { icon: Volume2, label: 'Help & Support' },
                        { icon: Settings, label: 'Logout' }
                    ].map((item, i) => (
                        <button
                            key={i}
                            className="w-full flex items-center justify-between py-6 px-4 border-b border-slate-100 group active:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center space-x-5">
                                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white shadow-md">
                                    <item.icon size={22} strokeWidth={2.5} />
                                </div>
                                <span className="font-bold text-lg text-slate-600 italic tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight size={22} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ))}
                </div>

                {/* Large Red Logout Button */}
                <div className="mt-auto mb-10 px-2">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#EF4444] text-white py-6 rounded-[1.5rem] font-black text-xl shadow-xl shadow-red-200 active:scale-95 transition-all"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
