import React from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';

export default function TermsModal({ isOpen, onClose, onAgree }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[4rem] p-10 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-b-[12px] border-slate-900 animate-in zoom-in-95 duration-500">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                    <X size={20} strokeWidth={3} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <ShieldCheck className="text-blue-600" size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                        Safety & Privacy
                    </h2>
                    <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mt-1">Passenger Agreement</p>
                </div>

                <div className="max-h-[300px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                    <div className="text-slate-600 text-[0.75rem] space-y-5 leading-relaxed font-bold italic">
                        <p>
                            By proceeding with this registration, I confirm that I have read and agreed to the <span className="text-blue-600">Inclusive.Route</span> Terms of Service.
                        </p>
                        <p>
                            I voluntarily give my consent to the collection, use, and processing of my personal data for biometric authentication and secure travel logging.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-[2rem] space-y-3 border-2 border-slate-100">
                            {[
                                "Access to identity verification",
                                "Request correction of data",
                                "Withdrawal of consent anytime",
                                "Object to external processing"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                        <Check size={12} className="text-white" strokeWidth={5} />
                                    </div>
                                    <span className="text-slate-500 font-black uppercase tracking-widest text-[0.55rem]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onAgree}
                    className="w-full py-6 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[0.75rem] shadow-xl active:scale-95 transition-all"
                >
                    I Accept Terms
                </button>
            </div>
        </div>
    );
}
