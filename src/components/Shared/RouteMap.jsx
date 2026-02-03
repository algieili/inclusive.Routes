import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Compass } from 'lucide-react';
import { useRoute } from '../../context/RouteContext';
import { getRouteByDestination } from '../../utils/mockRoutes';
import { reverseGeocode } from '../../utils/mapUtils';

// Helper to calculate distance
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Set token safely
const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
if (token) {
    mapboxgl.accessToken = token;
}

export default function RouteMap() {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);
    const watchIdRef = useRef(null);
    const animationIntervalRef = useRef(null);
    const destMarkerRef = useRef(null);
    const userMarkerRef = useRef(null);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [hasArrived, setHasArrived] = useState(false);
    const [liveDistance, setLiveDistance] = useState(null);

    const { currentRoute, isNavigating, startNavigation: contextStartNavigation } = useRoute();
    const currentRouteRef = useRef(currentRoute);

    useEffect(() => {
        currentRouteRef.current = currentRoute;
    }, [currentRoute]);

    // Animate line utility
    const animateLine = (map, coordinates) => {
        if (!map || !coordinates) return;
        let i = 0;
        const total = coordinates.length;
        const currentPath = [];

        if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);

        animationIntervalRef.current = setInterval(() => {
            if (i < total) {
                currentPath.push(coordinates[i]);
                const source = map.getSource('route');
                if (source) {
                    source.setData({
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: currentPath
                        }
                    });
                }
                i++;
            } else {
                clearInterval(animationIntervalRef.current);
            }
        }, 30);
    };

    // Location Tracking setup
    const startLocationTracking = (map) => {
        if (!map) return;
        if ('geolocation' in navigator) {
            if (userMarkerRef.current) {
                const el = userMarkerRef.current.getElement();
                if (el) el.style.transition = 'transform 0.5s ease-out';
            }

            watchIdRef.current = navigator.geolocation.watchPosition(async (position) => {
                const { longitude: lng, latitude: lat } = position.coords;
                const pos = { lat, lng };

                setCurrentPosition(pos);
                if (userMarkerRef.current) {
                    userMarkerRef.current.setLngLat([lng, lat]);
                }

                if (!userMarkerRef.current) return;
                const labelEl = userMarkerRef.current.getElement().querySelector('#user-location-label');
                if (labelEl) {
                    const currentLabel = labelEl.innerText;
                    if (currentLabel === 'Your Location' || Math.random() < 0.1) {
                        try {
                            const address = await reverseGeocode(lng, lat, token);
                            if (address) {
                                labelEl.innerText = address.split(',')[0].toUpperCase();
                                labelEl.style.display = 'block';
                            }
                        } catch (e) {
                            console.error('Geocoding error:', e);
                        }
                    }
                }

                if (!currentRouteRef.current && map) {
                    map.easeTo({
                        center: [lng, lat],
                        zoom: map.getZoom() < 14 ? 15 : map.getZoom(),
                        duration: 1000
                    });
                }
            },
                (error) => console.error('GPS Navigation Error:', error.message),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 });
        }
    };

    // Initialize Mapbox Map
    useEffect(() => {
        if (!mapContainer.current || mapInstance.current) return;

        // Safety: If no token, still allow the UI to mount but log error
        if (!token) {
            console.error("Mapbox Access Token is missing!");
            // We set mapLoaded to true anyway after a delay to allow UI to show up without map
            setTimeout(() => setMapLoaded(true), 2000);
            return;
        }

        let map;
        try {
            map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [121.08, 14.32],
                zoom: 15,
                pitch: 45,
                attributionControl: false,
                logoPosition: 'bottom-right'
            });

            map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

            map.on('load', () => {
                mapInstance.current = map;

                const el = document.createElement('div');
                el.className = 'user-marker';
                el.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none;">
                        <div id="user-location-label" style="background: white; color: #2563EB; padding: 8px 16px; border-radius: 12px; margin-bottom: 8px; font-weight: 900; font-size: 14px; white-space: nowrap; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 3px solid #2563EB; text-transform: uppercase; font-style: italic; display: none; position: relative;">
                            Locating...
                            <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #2563EB;"></div>
                        </div>
                        <div style="font-size: 64px; filter: drop-shadow(0 6px 15px rgba(0,0,0,0.4)); transform: scaleX(-1);">🚌</div>
                    </div>
                `;

                userMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
                    .setLngLat([121.08, 14.32])
                    .addTo(map);

                startLocationTracking(map);
                setMapLoaded(true);
            });

            map.on('error', (e) => {
                console.error('Mapbox error:', e);
                setMapLoaded(true); // Don't hang forever
            });

        } catch (e) {
            console.error('Error initializing Mapbox:', e);
            setMapLoaded(true);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
            if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
        };
    }, []);

    // Arrival Detection logic
    useEffect(() => {
        if (!currentRoute || !currentPosition) return;

        let destLat, destLng;
        if (currentRoute.destinationLocation) {
            destLat = currentRoute.destinationLocation.lat;
            destLng = currentRoute.destinationLocation.lng;
        } else if (currentRoute.destination && typeof currentRoute.destination !== 'string' && currentRoute.destination.coordinates) {
            [destLng, destLat] = currentRoute.destination.coordinates;
        } else {
            return;
        }

        const distanceMeters = getDistanceFromLatLonInMeters(
            currentPosition.lat, currentPosition.lng,
            destLat, destLng
        );

        if (distanceMeters > 1000) {
            setLiveDistance(`${(distanceMeters / 1000).toFixed(1)} KM`);
        } else {
            setLiveDistance(`${Math.round(distanceMeters)} M`);
        }

        if (distanceMeters < 50 && !hasArrived) {
            setHasArrived(true);
        }
    }, [currentPosition, currentRoute, hasArrived]);

    // Route Update logic
    useEffect(() => {
        if (!mapLoaded || !mapInstance.current || !currentRoute) return;
        const map = mapInstance.current;
        const addRouteToMap = (map, coordinates, endPoint, destinationName) => {
            if (!map || !coordinates) return;
            if (map.getLayer('route-line')) map.removeLayer('route-line');
            if (map.getSource('route')) map.removeSource('route');
            if (destMarkerRef.current) {
                destMarkerRef.current.remove();
                destMarkerRef.current = null;
            }

            const el = document.createElement('div');
            el.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none;">
                    <div style="background: white; padding: 10px 24px; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); margin-bottom: 2px; border: 4px solid #2563EB; animation: float 2s ease-in-out infinite;">
                        <span style="font-size: 18px; font-weight: 900; white-space: nowrap; color: #1E293B; text-transform: uppercase; font-style: italic;">
                            ${destinationName || 'Destination'}
                        </span>
                    </div>
                    <div style="font-size: 84px; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.4)); animation: pin-bounce 1s ease-out;">📍</div>
                </div>
            `;

            destMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
                .setLngLat(endPoint)
                .addTo(map);

            map.addSource('route', {
                type: 'geojson',
                data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
            });

            map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#2563EB', 'line-width': 14, 'line-opacity': 0.95 }
            });

            const bounds = new mapboxgl.LngLatBounds();
            coordinates.forEach(coord => bounds.extend(coord));
            map.fitBounds(bounds, { padding: { top: 180, bottom: 280, left: 60, right: 60 }, duration: 1000 });
            animateLine(map, coordinates);
        };

        const displayRealRoute = async (map, routeData) => {
            try {
                const start = [routeData.origin.lng, routeData.origin.lat];
                const end = [routeData.destinationLocation.lng, routeData.destinationLocation.lat];
                const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${token}`);
                const json = await query.json();
                if (json.routes && json.routes.length > 0) {
                    addRouteToMap(map, json.routes[0].geometry.coordinates, end, routeData.destination);
                } else {
                    displayMockRoute(map, routeData);
                }
            } catch (e) {
                displayMockRoute(map, routeData);
            }
        };

        const displayMockRoute = (map, routeData) => {
            const mock = getRouteByDestination(routeData.destination);
            if (mock) addRouteToMap(map, mock.routeLine, mock.destination.coordinates, routeData.destination);
        };

        const origin = currentPosition || currentRoute.origin;
        if (currentRoute.useRealDirections && origin && currentRoute.destinationLocation) {
            displayRealRoute(map, { ...currentRoute, origin });
        } else {
            displayMockRoute(map, currentRoute);
        }

    }, [mapLoaded, currentRoute, isNavigating]);

    return (
        <div className="absolute inset-0 w-full h-full bg-[#f8fafc]">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

            {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[1000]">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-bold italic text-sm">Loading...</p>
                    </div>
                </div>
            )}

            {isNavigating && !hasArrived && (
                <div className="absolute top-28 left-6 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl z-30 flex items-center space-x-3 border border-white/20">
                    <div className="relative h-4 w-4">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                    </div>
                    <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] italic">Tracking Active</span>
                </div>
            )}

            {currentRoute && isNavigating && !hasArrived && (
                <div className="absolute top-28 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-2xl z-20 flex flex-col items-end border border-blue-50">
                    <span className="text-[0.5rem] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Distance to End</span>
                    <span className="text-3xl font-black text-slate-800 tracking-tighter italic">{liveDistance || currentRoute.distance}</span>
                </div>
            )}

            {hasArrived && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-700">
                    <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center border-b-[12px] border-green-500 max-w-sm w-full relative overflow-hidden">
                        <h2 className="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tighter italic">ARRIVED</h2>
                        <button onClick={() => setHasArrived(false)} className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] mt-6">Finish Trip</button>
                    </div>
                </div>
            )}
        </div>
    );
}
