import React, { createContext, useContext, useState } from 'react';

const RouteContext = createContext();

export const useRoute = () => {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error('useRoute must be used within RouteProvider');
    }
    return context;
};

export const RouteProvider = ({ children }) => {
    const [currentRoute, setCurrentRoute] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [favorites, setFavorites] = useState([
        { name: "Home", location: "Default Location", coordinates: [121.0644, 14.6760] },
        { name: "Work", location: "Saved Location", coordinates: [121.0500, 14.6500] }
    ]);

    const setRoute = (routeData) => {
        setCurrentRoute(routeData);
    };

    const startNavigation = () => setIsNavigating(true);
    const stopNavigation = () => setIsNavigating(false);

    const clearRoute = () => {
        setCurrentRoute(null);
    };

    const addFavorite = (place) => {
        setFavorites(prev => [...prev, place]);
    };

    const removeFavorite = (placeName) => {
        setFavorites(prev => prev.filter(fav => fav.name !== placeName));
    };

    const isFavorite = (placeName) => {
        return favorites.some(fav => fav.name === placeName);
    };

    return (
        <RouteContext.Provider
            value={{
                currentRoute,
                isNavigating,
                setRoute,
                startNavigation,
                stopNavigation,
                clearRoute,
                favorites,
                addFavorite,
                removeFavorite,
                isFavorite
            }}
        >
            {children}
        </RouteContext.Provider>
    );
};
