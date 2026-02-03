
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-900 flex justify-center overflow-hidden">
            {/* 
               Simplified MainLayout: 
               The specialized mobile-first design is now handled 
               at the page level for Passenger and Navigation views 
                to emphasize map and searchbar as requested.
            */}
            <main className="w-full h-full">
                <Outlet />
            </main>
        </div>
    );
}
