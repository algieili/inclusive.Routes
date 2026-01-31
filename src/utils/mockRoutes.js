// Mock route data for Philippine locations (Laguna area)
// Coordinates in [longitude, latitude] format

export const MOCK_ROUTES = {
    'Crossing': {
        origin: { name: 'San Pedro', coordinates: [121.0644, 14.3553] },
        destination: { name: 'Crossing', coordinates: [121.0950, 14.3720] },
        routeLine: [
            [121.0644, 14.3553],  // Start - San Pedro
            [121.0710, 14.3580],
            [121.0780, 14.3620],
            [121.0850, 14.3670],
            [121.0920, 14.3700],
            [121.0950, 14.3720]   // End - Crossing
        ],
        jeepneyPositions: [
            { coordinates: [121.0740, 14.3595], direction: 'east' },
            { coordinates: [121.0830, 14.3650], direction: 'east' },
            { coordinates: [121.0900, 14.3690], direction: 'east' }
        ]
    },
    'Pulo': {
        origin: { name: 'San Pedro', coordinates: [121.0644, 14.3553] },
        destination: { name: 'Pulo', coordinates: [121.0800, 14.3650] },
        routeLine: [
            [121.0644, 14.3553],
            [121.0690, 14.3580],
            [121.0730, 14.3600],
            [121.0770, 14.3625],
            [121.0800, 14.3650]
        ],
        jeepneyPositions: [
            { coordinates: [121.0710, 14.3590], direction: 'east' },
            { coordinates: [121.0750, 14.3615], direction: 'east' }
        ]
    },
    'Market Area': {
        origin: { name: 'San Pedro', coordinates: [121.0644, 14.3553] },
        destination: { name: 'Market Area', coordinates: [121.1100, 14.3800] },
        routeLine: [
            [121.0644, 14.3553],
            [121.0730, 14.3590],
            [121.0820, 14.3640],
            [121.0910, 14.3690],
            [121.1000, 14.3750],
            [121.1100, 14.3800]
        ],
        jeepneyPositions: [
            { coordinates: [121.0775, 14.3615], direction: 'east' },
            { coordinates: [121.0865, 14.3665], direction: 'east' },
            { coordinates: [121.0955, 14.3720], direction: 'east' }
        ]
    },
    'Banlic': {
        origin: { name: 'San Pedro', coordinates: [121.0644, 14.3553] },
        destination: { name: 'Banlic', coordinates: [121.1050, 14.3750] },
        routeLine: [
            [121.0644, 14.3553],
            [121.0720, 14.3585],
            [121.0800, 14.3630],
            [121.0880, 14.3670],
            [121.0960, 14.3710],
            [121.1050, 14.3750]
        ],
        jeepneyPositions: [
            { coordinates: [121.0760, 14.3608], direction: 'east' },
            { coordinates: [121.0840, 14.3650], direction: 'east' },
            { coordinates: [121.0920, 14.3690], direction: 'east' }
        ]
    },
    'Malaban': {
        origin: { name: 'San Pedro', coordinates: [121.0644, 14.3553] },
        destination: { name: 'Malaban', coordinates: [121.1200, 14.3850] },
        routeLine: [
            [121.0644, 14.3553],
            [121.0750, 14.3600],
            [121.0850, 14.3660],
            [121.0950, 14.3720],
            [121.1050, 14.3780],
            [121.1150, 14.3820],
            [121.1200, 14.3850]
        ],
        jeepneyPositions: [
            { coordinates: [121.0800, 14.3630], direction: 'east' },
            { coordinates: [121.0900, 14.3690], direction: 'east' },
            { coordinates: [121.1000, 14.3750], direction: 'east' },
            { coordinates: [121.1100, 14.3805], direction: 'east' }
        ]
    },
    'Cabuyao': {
        origin: { name: 'Calamba', coordinates: [121.1653, 14.2110] },
        destination: { name: 'Cabuyao', coordinates: [121.1239, 14.2780] },
        routeLine: [
            [121.1653, 14.2110],  // Calamba
            [121.1600, 14.2250],
            [121.1520, 14.2400],
            [121.1450, 14.2550],
            [121.1380, 14.2670],
            [121.1300, 14.2730],
            [121.1239, 14.2780]   // Cabuyao
        ],
        jeepneyPositions: [
            { coordinates: [121.1560, 14.2325], direction: 'north' },
            { coordinates: [121.1485, 14.2475], direction: 'north' },
            { coordinates: [121.1340, 14.2700], direction: 'north' }
        ]
    }
};

// Default route if destination not found
export const DEFAULT_ROUTE = MOCK_ROUTES['Crossing'];

// Helper function to get route by destination name
export const getRouteByDestination = (destinationName) => {
    return MOCK_ROUTES[destinationName] || DEFAULT_ROUTE;
};

// Helper to create GeoJSON for route line
export const createRouteGeoJSON = (coordinates) => {
    return {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: coordinates
        }
    };
};

// Helper to calculate bounds for camera fit
export const calculateRouteBounds = (coordinates) => {
    const lngs = coordinates.map(coord => coord[0]);
    const lats = coordinates.map(coord => coord[1]);

    return [
        [Math.min(...lngs), Math.min(...lats)], // Southwest
        [Math.max(...lngs), Math.max(...lats)]  // Northeast
    ];
};
