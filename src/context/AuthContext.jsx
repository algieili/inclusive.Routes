
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [accessibility, setAccessibility] = useState({
        highContrast: false,
        largeText: false,
        voiceGuidance: false
    });

    useEffect(() => {
        // Simulate checking local storage for potential persistence
        const storedUser = localStorage.getItem('inclusive_user');
        const storedAccess = localStorage.getItem('inclusive_accessibility');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedAccess) {
            setAccessibility(JSON.parse(storedAccess));
        }
        setLoading(false);
    }, []);

    const updateAccessibility = (newSettings) => {
        const updated = { ...accessibility, ...newSettings };
        setAccessibility(updated);
        localStorage.setItem('inclusive_accessibility', JSON.stringify(updated));
    };

    const login = (role, username) => {
        const newUser = { role, username, id: Date.now() };
        setUser(newUser);
        localStorage.setItem('inclusive_user', JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('inclusive_user');
        // Keep accessibility settings even after logout? 
        // Usually good for accessibility consistency.
    };

    const register = (userData) => {
        console.log("Registered:", userData);
        const newUser = { role: 'passenger', username: userData.email, name: userData.name, id: Date.now() };
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, accessibility, updateAccessibility }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
