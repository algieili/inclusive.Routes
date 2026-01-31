import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, Bus, DollarSign, User, Receipt, Plus, ChevronRight, CheckCircle2, History, TrendingUp } from 'lucide-react';

export default function ConductorDashboard() {
    const [activeTab, setActiveTab] = useState('Fare Collection');
    const [collectedTotal, setCollectedTotal] = useState(1850.00);
    const [isCollecting, setIsCollecting] = useState(false);
    const [lastAction, setLastAction] = useState(null);

    // Mock Transaction Data
    const transactions = [
        { id: 1, unit: 'SIA 506', plate: 'PUJ-1234', passengers: 12, earnings: '156.00', type: 'REGULAR', time: '7:45 PM' },
        { id: 2, unit: 'SIA 506', plate: 'PUJ-1234', passengers: 8, earnings: '80.00', type: 'STUDENT', time: '7:30 PM' },
        { id: 3, unit: 'SIA 506', plate: 'PUJ-1234', passengers: 15, earnings: '195.00', type: 'REGULAR', time: '7:15 PM' },
    ];

    const handleCollectFare = (amount, type) => {
        setIsCollecting(true);
        setLastAction({ amount, type });

        setTimeout(() => {
            setCollectedTotal(prev => prev + amount);
            setIsCollecting(false);
            // Show toast or secondary feedback
        }, 600);
    };

    const renderFareCollection = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Quick Fare Grid */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleCollectFare(13, 'REGULAR')}
                    className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-100 hover:border-teal-500 transition-all active:scale-95 flex flex-col items-center group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <span className="text-4xl mb-2">🚌</span>
                    <p className="text-slate-400 font-black text-[0.65rem] uppercase tracking-widest mb-1">Regular</p>
                    <span className="text-3xl font-black text-slate-800 tracking-tighter italic">₱13.00</span>
                </button>
                <button
                    onClick={() => handleCollectFare(10, 'PWD/SENIOR')}
                    className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-100 hover:border-blue-500 transition-all active:scale-95 flex flex-col items-center group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <span className="text-4xl mb-2">♿</span>
                    <p className="text-slate-400 font-black text-[0.65rem] uppercase tracking-widest mb-1">Discount</p>
                    <span className="text-3xl font-black text-slate-800 tracking-tighter italic">₱10.00</span>
                </button>
            </div>

            {/* Custom Manual Entry */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="relative flex items-center justify-between">
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] text-teal-400 mb-2 italic">Manual Payment</h4>
                        <p className="text-white/60 text-[0.65rem] font-bold">Input custom amount for groups or extra luggage.</p>
                    </div>
                    <button className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-110 transition-transform active:scale-90">
                        <Plus className="text-white" size={28} strokeWidth={4} />
                    </button>
                </div>
            </div>

            {/* Recent Collection Logic */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest italic">Recent Hits</h3>
                    <TrendingUp className="text-teal-500" size={18} />
                </div>
                {transactions.slice(0, 2).map((t, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white flex justify-between items-center shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="bg-teal-100 p-2.5 rounded-xl text-teal-600">
                                <Receipt size={18} />
                            </div>
                            <div>
                                <h5 className="font-black text-slate-800 text-xs uppercase tracking-tighter italic leading-none">{t.type} PASSENGER</h5>
                                <p className="text-slate-400 text-[0.6rem] font-bold mt-1">TIME • {t.time}</p>
                            </div>
                        </div>
                        <span className="font-black text-slate-800 text-lg tracking-tighter">₱{t.earnings}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderFareReports = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-500">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100">
                <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="text-teal-500" />
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs italic">Summary • Apr 24</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-slate-400 font-black text-[0.55rem] uppercase tracking-widest mb-1">Total Trips</p>
                        <p className="text-2xl font-black text-slate-800 italic">14</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-slate-400 font-black text-[0.55rem] uppercase tracking-widest mb-1">Passengers</p>
                        <p className="text-2xl font-black text-slate-800 italic">284</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {transactions.map((t, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 group hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                    <Bus size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-sm tracking-tight italic leading-none">{t.unit}</h4>
                                    <p className="text-slate-400 text-[0.6rem] font-bold uppercase mt-1 tracking-widest">{t.plate}</p>
                                </div>
                            </div>
                            <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-widest">Completed</div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <p className="text-slate-500 text-xs font-bolditalic">Collection: <span className="text-slate-800 font-black">₱{t.earnings}</span></p>
                            <ChevronRight className="text-slate-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEReceipts = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-5 duration-500">
            {transactions.map((t, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-[4rem]"></div>
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 text-base uppercase tracking-tighter italic leading-none">Receipt #{t.id}09432</h4>
                            <p className="text-slate-400 text-[0.6rem] font-bold uppercase tracking-widest mt-1">Issued at {t.time}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-4 border-y border-dashed border-slate-200 mb-6">
                        <span className="text-slate-400 font-black text-xs uppercase italic">Total Paid</span>
                        <span className="text-3xl font-black text-slate-800 tracking-tighter">₱{t.earnings}</span>
                    </div>
                    <button className="w-full bg-teal-500 text-white font-black py-4 rounded-3xl shadow-xl shadow-teal-100 uppercase tracking-widest text-[0.7rem] transition-all active:scale-95 group flex items-center justify-center space-x-2">
                        <span>Re-Issue Ticket</span>
                        <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-[#f0f9ff] min-h-screen relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]"></div>

            <div className="max-w-md mx-auto p-6 pb-32 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white">
                            <Bus className="text-teal-500" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                Condu<span className="text-teal-500">.Route</span>
                            </h1>
                            <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Conductor Panel</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl border-4 border-white shadow-xl overflow-hidden active:scale-90 transition-transform">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ConductorJoe" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Main Stats Card */}
                <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(20,184,166,0.15)] border-b-[10px] border-teal-600 mb-10 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="text-teal-500" size={16} />
                            <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest italic">Today's Collection</h3>
                        </div>
                        <div className="flex items-end space-x-2">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter italic">₱{collectedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <TrendingUp className="text-green-500 mb-2" size={24} />
                        </div>

                        <div className="mt-8 flex items-center space-x-3 text-slate-400 font-bold text-xs uppercase italic">
                            <RefreshCw size={14} className={isCollecting ? 'animate-spin text-teal-500' : ''} />
                            <span>Last update: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-2 mb-10 bg-white/60 backdrop-blur-md p-2 rounded-[2.5rem] border border-white shadow-xl">
                    {['Fare Collection', 'Fare Reports', 'E-Receipts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-[0.6rem] font-black uppercase tracking-widest rounded-[2rem] transition-all duration-300 ${activeTab === tab ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/40 scale-105' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                        >
                            {tab.split(' ')[1] || tab}
                        </button>
                    ))}
                </div>

                {/* Dynamic Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'Fare Collection' && renderFareCollection()}
                    {activeTab === 'Fare Reports' && renderFareReports()}
                    {activeTab === 'E-Receipts' && renderEReceipts()}
                </div>

                {/* Feedback Toast Overlay */}
                {isCollecting && (
                    <div className="fixed bottom-28 left-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <div className="bg-teal-500 rounded-3xl p-5 shadow-2xl flex items-center justify-between text-white border-b-4 border-teal-700">
                            <div className="flex items-center space-x-4">
                                <CheckCircle2 className="animate-bounce" size={24} />
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest italic leading-none">Payment Collected!</p>
                                    <p className="text-[0.6rem] font-bold opacity-80 mt-1">₱{lastAction?.amount} {lastAction?.type} added to total.</p>
                                </div>
                            </div>
                            <span className="text-sm">⚡</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
