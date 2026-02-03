// Helper to calculate distance between two coordinates in km
export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Mapbox Geocoding Helper
export const searchPlaces = async (query, accessToken) => {
    if (!query) return [];
    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=ph&access_token=${accessToken}`
        );
        const data = await response.json();
        return data.features || [];
    } catch (error) {
        console.error("Geocoding error:", error);
        return [];
    }
};

export const reverseGeocode = async (lng, lat, accessToken) => {
    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            return data.features[0].place_name;
        }
        return "Unknown Location";
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return "Location Error";
    }
};
