import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ChevronRight } from 'lucide-react';
import TermsModal from './TermsModal';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isEmployee, setIsEmployee] = useState(false); // Toggle for Employee Login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple mock role assignment
        const role = isEmployee ? 'conductor' : 'passenger';
        login(role, username);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background Map Element (Mock) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center"></div>

            <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-sm border-4 border-slate-100 relative z-10">

                {/* Employee Toggle (Top Corners or just a switch) */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setIsEmployee(!isEmployee)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${isEmployee ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                    >
                        {isEmployee ? 'Employee Mode' : 'Passenger Mode'}
                    </button>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 border-4 border-red-50">
                        <User className="text-red-500" size={40} />
                    </div>
                    <div className="bg-red-50 px-4 py-1 rounded-full">
                        <h2 className="text-red-500 font-bold tracking-widest text-sm uppercase">Inclusive.Route</h2>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 mt-4">{isEmployee ? 'Employee Login' : 'Login'}</h1>
                    <p className="text-slate-400 text-sm">Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Fields matching 'Employee Login' simple style */}
                    <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center">
                        <User className="text-slate-400 mr-3" size={20} />
                        <input
                            type="text"
                            placeholder={isEmployee ? "Operator / Conductor ID" : "Username"}
                            className="bg-transparent outline-none w-full text-slate-700 font-bold placeholder:font-normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center">
                        <Lock className="text-slate-400 mr-3" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent outline-none w-full text-slate-700 font-bold placeholder:font-normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <p className="text-right text-xs text-slate-400 font-bold cursor-pointer hover:text-red-500">Forgot Password?</p>

                    <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 transition-transform active:scale-95 text-lg">
                        {isEmployee ? 'Log In' : 'Log In'}
                    </button>
                </form>

                {!isEmployee && (
                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/register" className="text-red-500 font-bold hover:underline">Signup!</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Register = () => {
    const { register } = useAuth();
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Map Background for Register too */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center"></div>

            <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-sm border-4 border-indigo-500 relative z-10">
                {/* Note: Mockup shows Indigo/Purple border for Register */}

                <div className="text-center mb-8">
                    <div className="inline-block bg-red-100 p-3 rounded-full mb-2">
                        <User className="text-red-500" size={32} />
                    </div>
                    <p className="text-red-500 font-bold text-xs tracking-widest uppercase mb-1">Inclusive.Route</p>
                    <h1 className="text-3xl font-black text-red-500 uppercase tracking-tighter">REGISTER NOW!</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full bg-slate-200/50 p-4 rounded-full text-center font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-red-400"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-slate-200/50 p-4 rounded-full text-center font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-red-400"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Create Password"
                            className="w-full bg-slate-200/50 p-4 rounded-full text-center font-bold text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-red-400"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-red-400 hover:bg-red-500 text-white font-black py-4 rounded-full shadow-lg text-xl uppercase tracking-widest mt-6">
                        REGISTER
                    </button>

                    <div className="text-center">
                        <button type="button" onClick={() => setShowTerms(true)} className="text-red-400 text-sm underline font-bold">
                            Terms and Condition
                        </button>
                    </div>
                </form>
            </div>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAgree={() => { setFormData({ ...formData, terms: true }); setShowTerms(false); }}
            />
        </div>
    );
};
