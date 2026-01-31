// Jeepney Fare Calculator
// Base fare structure for Philippines jeepney fares
export const BASE_FARE = 13.00; // First 4km
export const PER_KM_RATE = 1.50; // Additional per km after 4km
export const DISCOUNT_RATE = 0.20; // 20% for PWD/Senior

// Distance database (mock data - km between cities)
export const ROUTE_DISTANCES = {
    'Calamba-Cabuyao': 5.2,
    'Cabuyao-Calamba': 5.2,
    'Crossing-Coolbase': 5.0,
    'Pulo-Coolbase': 4.5,
    'Market Area-Midas': 6.0,
    'Banlic-Midas': 5.5,
    'Malaban-iCity': 7.0,
};

export const calculateFare = (distanceKM = 5, passengerType = 'REGULAR') => {
    // Calculate base fare
    let grossFare = BASE_FARE;

    // Add surcharge for distance beyond 4km
    if (distanceKM > 4) {
        const extraKM = distanceKM - 4;
        grossFare += extraKM * PER_KM_RATE;
    }

    // Round to nearest peso
    grossFare = Math.round(grossFare);

    // Calculate discount for PWD/Senior
    let discount = 0;
    if (passengerType === 'PWD' || passengerType === 'SENIOR') {
        discount = grossFare * DISCOUNT_RATE;
    }

    const netFare = grossFare - discount;

    return {
        grossFare: grossFare.toFixed(2),
        discount: discount.toFixed(2),
        netFare: netFare.toFixed(2),
        distanceKM: distanceKM.toFixed(1),
        currency: 'PHP'
    };
};

// Get distance between two locations
export const getRouteDistance = (origin, destination) => {
    const routeKey = `${origin}-${destination}`;
    return ROUTE_DISTANCES[routeKey] || 5.0; // Default 5km
};
