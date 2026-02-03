import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ChevronRight, ShieldCheck, BusFront, Compass, MapPin } from 'lucide-react';
import TermsModal from './TermsModal';
import RouteMap from '../Shared/RouteMap';

export const Login = () => {
    const { login, accessibility } = useAuth();
    const navigate = useNavigate();
    const [isEmployee, setIsEmployee] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const role = isEmployee ? 'conductor' : 'passenger';
        login(role, username);
        navigate('/dashboard');
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${accessibility?.highContrast ? 'bg-slate-950' : 'bg-slate-50'}`}>

            {/* Top Fixed Mode Selector (Maintained from previous request) */}
            <div className="w-full max-w-sm absolute top-12 left-1/2 -translate-x-1/2 z-[100] px-6">
                <div className={`p-1.5 rounded-[2rem] flex items-center backdrop-blur-xl border transition-all ${accessibility?.highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-slate-200'}`}>
                    <button
                        onClick={() => setIsEmployee(false)}
                        className={`flex-1 py-3 rounded-full text-[0.6rem] font-black uppercase tracking-widest transition-all ${!isEmployee ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                        Passenger
                    </button>
                    <button
                        onClick={() => setIsEmployee(true)}
                        className={`flex-1 py-3 rounded-full text-[0.6rem] font-black uppercase tracking-widest transition-all ${isEmployee ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                        Employee
                    </button>
                </div>
            </div>

            {/* Background elements (Subtle Map) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none grayscale">
                <svg className="w-full h-full" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,100 Q100,200 200,100 T400,100" stroke="#000" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="200" cy="400" r="150" stroke="#000" strokeWidth="1" strokeDasharray="10 10" />
                </svg>
            </div>

            <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-700">
                {/* Main Login Card */}
                <div className={`bg-white rounded-[3.5rem] p-10 py-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center relative overflow-hidden ${accessibility?.highContrast ? 'bg-slate-900 border-slate-800' : ''}`}>

                    {/* Role Badge */}
                    <div className="absolute top-8 right-10">
                        <div className="bg-slate-100 px-4 py-1.5 rounded-full">
                            <span className="text-slate-500 text-[0.6rem] font-bold uppercase tracking-widest">{isEmployee ? 'Employee Mode' : 'Passenger Mode'}</span>
                        </div>
                    </div>

                    {/* Circular Profile Icon */}
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 border-2 border-red-100 shadow-inner">
                        <User className="text-[#FF4A3F]" size={40} strokeWidth={2.5} />
                    </div>

                    {/* Brand Pill */}
                    <div className="bg-red-50/50 px-6 py-2 rounded-full mb-8 border border-red-100/50">
                        <span className="text-[#FF4A3F] font-black text-[0.7rem] uppercase tracking-[0.2em]">INCLUSIVE.ROUTE</span>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-slate-800 text-4xl font-black mb-1">Login</h1>
                        <p className="text-slate-400 text-sm font-medium">Sign in to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <div className="relative group">
                            <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Username"
                                className={`w-full py-5 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-200 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-400`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                className={`w-full py-5 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-200 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-400`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="text-right px-2">
                            <button type="button" className="text-slate-400 text-[0.7rem] font-bold hover:text-blue-600 transition-colors">Forgot Password?</button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-[#FF4A3F] text-white rounded-3xl font-black text-xl shadow-[0_15px_30px_rgba(255,74,63,0.3)] hover:translate-y-[-2px] active:translate-y-1 transition-all mt-4"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-400 text-sm font-bold">
                            Already have an account? <Link to="/register" className="text-[#FF4A3F] hover:underline">Signup!</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Register = () => {
    const { register, accessibility } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', terms: false });
    const [showTerms, setShowTerms] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.terms) {
            alert("Please accept the Terms & Conditions");
            return;
        }
        register(formData);
        navigate('/');
    };

    return (
        <div className={`min-h-screen flex flex-col items-center bg-white p-6 relative overflow-hidden transition-colors duration-500 ${accessibility?.highContrast ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>

            {/* Background Map Silhouette */}
            <div className="absolute inset-x-0 bottom-0 z-0 opacity-40 pointer-events-none overflow-hidden grayscale translate-y-20">
                <svg className="w-full h-full scale-150 origin-bottom" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,100 C50,100 80,80 100,100 S150,150 200,120 S300,180 380,100 V700 H20 Z" fill="#BFDBFE" />
                </svg>
            </div>

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center pt-10 pb-12 animate-in fade-in zoom-in-95 duration-700">

                {/* Header Menu Dots */}
                <div className="w-full flex justify-between px-4 mb-4 text-[#1E293B]">
                    <div className="flex space-x-1.5"><div className="w-2 h-2 bg-blue-900 rounded-full"></div><div className="w-2 h-2 bg-blue-900 rounded-full"></div><div className="w-2 h-2 bg-blue-900 rounded-full"></div></div>
                    <div className="flex space-x-1.5"><div className="w-2 h-2 bg-blue-900 rounded-full"></div><div className="w-2 h-2 bg-blue-900 rounded-full"></div><div className="w-2 h-2 bg-blue-900 rounded-full"></div></div>
                </div>

                {/* Big Pin Icon */}
                <div className="mb-4">
                    <div className="text-[110px] leading-none drop-shadow-xl">📍</div>
                </div>

                <p className="text-[#FF4A3F] font-black uppercase tracking-[0.3em] text-[0.7rem] mb-6 italic">INCLUSIVE.ROUTE</p>

                <h1 className="text-[#FF4A3F] text-4xl font-black tracking-tighter mb-10 uppercase italic">REGISTER NOW!</h1>

                <form onSubmit={handleSubmit} className="w-full space-y-6 px-6">
                    <div className="space-y-4">
                        <div className="flex flex-col items-center">
                            <input
                                type="text"
                                className="w-full py-6 rounded-full bg-slate-200/80 border-none outline-none text-center font-bold text-slate-700 shadow-inner"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <p className="text-[#FF4A3F] font-bold text-sm tracking-tight mt-2 italic">Full name</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <input
                                type="email"
                                className="w-full py-6 rounded-full bg-slate-200/80 border-none outline-none text-center font-bold text-slate-700 shadow-inner"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <p className="text-[#FF4A3F] font-bold text-sm tracking-tight mt-2 italic">Email Adress</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <input
                                type="password"
                                className="w-full py-6 rounded-full bg-slate-200/80 border-none outline-none text-center font-bold text-slate-700 shadow-inner"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <p className="text-[#FF4A3F] font-bold text-sm tracking-tight mt-2 italic">Create Password</p>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            className="w-full bg-slate-200/80 p-5 rounded-full shadow-lg active:scale-95 transition-all outline-none flex items-center justify-center h-20"
                        >
                            <span className="text-[#FF4A3F] font-black text-3xl uppercase tracking-tighter italic">REGISTER</span>
                        </button>

                        <button type="button" onClick={() => setShowTerms(true)} className="text-[#FF4A3F] font-bold text-sm tracking-tight mt-6 block mx-auto italic hover:underline">
                            Terms and Condition
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <Link to="/" className="text-slate-400 text-[0.65rem] font-bold uppercase tracking-widest italic hover:text-red-500 transition-all">Already have an account? Login</Link>
                    </div>
                </form>

                {/* Bottom Illustration (Philippine Jeepney Logo) */}
                <div className="mt-8 w-full px-2 flex justify-start opacity-100 transition-transform hover:scale-105 origin-left">
                    <img
                        src="/jeepney-logo.png"
                        alt="Jeepney Illustration"
                        className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply"
                    />
                </div>
            </div>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAgree={() => { setFormData({ ...formData, terms: true }); setShowTerms(false); }}
            />
        </div>
    );
};
