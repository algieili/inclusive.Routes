import React from 'react';
import { X } from 'lucide-react';

export default function TermsModal({ isOpen, onClose, onAgree }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-blue-300 w-full max-w-sm rounded-[3rem] p-8 relative shadow-2xl border-4 border-slate-800">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/40"
                >
                    <X className="text-slate-800" />
                </button>

                <h2 className="text-center text-red-500 font-extrabold text-2xl mb-6 uppercase tracking-wider drop-shadow-sm">
                    Terms and Condition
                </h2>

                <div className="text-center text-slate-800 text-xs space-y-4 mb-6 leading-relaxed font-medium">
                    <p className="font-bold">Data Privacy Consent and Agreement</p>
                    <p>
                        By proceeding with this registration, I hereby confirm that I have read, understood, and agreed to the Terms and Conditions of this application.
                    </p>
                    <p>
                        I freely, knowingly, and voluntarily give my consent to the collection, use, processing, storage, and retention of my personal data provided through this sign-up form.
                    </p>
                    <p>
                        I understand that my personal information will be collected solely for legitimate purposes, including but not limited to account creation, user authentication, system operation, and security.
                    </p>

                    <ul className="text-left pl-4 list-disc space-y-1 mt-2">
                        <li>Access my personal data</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Object to data processing</li>
                        <li>Request deletion or withdrawal of consent</li>
                    </ul>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <label className="flex items-center space-x-2 cursor-pointer font-bold text-lg text-slate-900">
                        <span>I agree</span>
                        <div className="w-6 h-6 border-2 border-slate-800 bg-white rounded flex items-center justify-center">
                            {/* Visual check only handled by parent usually but here simplified */}
                            <input type="checkbox" className="w-4 h-4 accent-slate-800" onChange={(e) => { if (e.target.checked) onAgree(); }} />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
