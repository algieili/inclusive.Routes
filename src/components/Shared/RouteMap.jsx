import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from '../../context/RouteContext';
import { getRouteByDestination } from '../../utils/mockRoutes';

export default function RouteMap() {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const routeLineRef = useRef(null);
    const directionsRendererRef = useRef(null);
    const watchIdRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [hasArrived, setHasArrived] = useState(false);
    const [liveDistance, setLiveDistance] = useState(null);

    const { currentRoute, isNavigating, startNavigation: contextStartNavigation } = useRoute();
    const currentRouteRef = useRef(currentRoute);

    useEffect(() => {
        currentRouteRef.current = currentRoute;
    }, [currentRoute]);

    // Initialize Google Map
    useEffect(() => {
        if (!mapContainer.current || mapInstance.current) return;

        const initMap = () => {
            if (!window.google || !window.google.maps) {
                setTimeout(initMap, 100);
                return;
            }

            const map = new window.google.maps.Map(mapContainer.current, {
                center: { lat: 14.32, lng: 121.08 },
                zoom: 15,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#333333' }]
                    }
                ]
            });

            mapInstance.current = map;
            setMapLoaded(true);

            // Add Traffic Layer
            const trafficLayer = new window.google.maps.TrafficLayer();
            trafficLayer.setMap(map);

            // Initialize DirectionsRenderer
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#3B82F6',
                    strokeWeight: 6,
                    strokeOpacity: 0.9
                }
            });

            // Start basic location tracking for the "Blue Dot"
            startLocationPulse();
        };

        const startLocationPulse = () => {
            if ('geolocation' in navigator) {
                const userMarker = new window.google.maps.Marker({
                    map: mapInstance.current,
                    label: {
                        text: '🚌',
                        fontSize: '28px'
                    },
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 1, // Minimize the circle, let the emoji lead
                        fillOpacity: 0,
                        strokeOpacity: 0
                    },
                    zIndex: 100,
                    title: 'Current Jeepney Location'
                });

                watchIdRef.current = navigator.geolocation.watchPosition((position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentPosition(pos);
                    userMarker.setPosition(pos);

                    // Only center if we haven't selected a route yet
                    if (!currentRouteRef.current) {
                        mapInstance.current.setCenter(pos);
                    }
                }, (error) => console.log('GPS Error', error), { enableHighAccuracy: true });
            }
        };

        initMap();

        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    // Reactive Arrival Detection & Distance Update
    useEffect(() => {
        if (!currentRoute || !currentRoute.destinationLocation || !currentPosition || !window.google || !window.google.maps.geometry) return;

        const google = window.google;
        const userLatLng = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
        const destLatLng = new google.maps.LatLng(
            currentRoute.destinationLocation.lat,
            currentRoute.destinationLocation.lng
        );

        const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, destLatLng);

        // Update live distance display
        if (distanceMeters > 1000) {
            setLiveDistance(`${(distanceMeters / 1000).toFixed(1)} KM`);
        } else {
            setLiveDistance(`${Math.round(distanceMeters)} M`);
        }

        // If within 50 meters, consider arrived
        if (distanceMeters < 50 && !hasArrived) {
            setHasArrived(true);
            // Optionally stop tracking
            if (watchIdRef.current) {
                // Keep tracking but mark as arrived
            }
        }
    }, [currentPosition, currentRoute, hasArrived]);

    // Update route when currentRoute changes
    useEffect(() => {
        if (!mapLoaded || !mapInstance.current || !currentRoute) return;

        const map = mapInstance.current;
        const google = window.google;

        // Clear existing markers and route
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (routeLineRef.current) {
            routeLineRef.current.setMap(null);
            routeLineRef.current = null;
        }

        // Check if we should use real GPS-based directions
        if (currentRoute.useRealDirections && currentRoute.origin && currentRoute.destinationLocation) {
            displayRealRoute(map, google, currentRoute);
        } else {
            displayMockRoute(map, google, currentRoute);
        }

    }, [mapLoaded, currentRoute]);

    // Display route using Google Directions API (GPS-based)
    const displayRealRoute = (map, google, routeData) => {
        const directionsService = new google.maps.DirectionsService();

        const request = {
            origin: new google.maps.LatLng(routeData.origin.lat, routeData.origin.lng),
            destination: new google.maps.LatLng(routeData.destinationLocation.lat, routeData.destinationLocation.lng),
            travelMode: google.maps.TravelMode.DRIVING,
            region: 'ph',
            avoidHighways: false, // JEEPNEY ONLY ON MAIN ROADS
            avoidTolls: false,
            optimizeWaypoints: true
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRendererRef.current.setDirections(result);

                // Add custom markers
                const route = result.routes[0];
                const leg = route.legs[0];

                // Destination marker (teal)
                const destMarker = new google.maps.Marker({
                    position: leg.end_location,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 14,
                        fillColor: '#14B8A6',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 4
                    },
                    label: {
                        text: '🎯',
                        fontSize: '22px'
                    },
                    title: routeData.destination
                });
                markersRef.current.push(destMarker);

                // Fit map to route
                map.fitBounds(result.routes[0].bounds, {
                    top: 150,
                    bottom: 350,
                    left: 60,
                    right: 60
                });

            } else {
                displayMockRoute(map, google, routeData);
            }
        });
    };

    // Display mock route data
    const displayMockRoute = (map, google, routeData) => {
        const mockRouteData = getRouteByDestination(routeData.destination);
        if (!mockRouteData) return;
        const { origin, destination, routeLine } = mockRouteData;

        // Create end marker (teal)
        const endMarker = new google.maps.Marker({
            position: { lat: destination.coordinates[1], lng: destination.coordinates[0] },
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: '#14B8A6',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 4
            },
            label: {
                text: '🚌',
                fontSize: '24px'
            },
            title: destination.name,
            animation: google.maps.Animation.BOUNCE
        });
        markersRef.current.push(endMarker);

        setTimeout(() => endMarker.setAnimation(null), 2000);

        const path = routeLine.map(coord => ({
            lat: coord[1],
            lng: coord[0]
        }));

        animateRoute(map, path, google);

        const bounds = new google.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point));
        map.fitBounds(bounds, {
            top: 150,
            bottom: 350,
            left: 60,
            right: 60
        });
    };

    // Animate route line drawing
    const animateRoute = (map, fullPath, google) => {
        const duration = 2500;
        const startTime = Date.now();
        let currentPolyline = null;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const pointCount = Math.max(2, Math.floor(fullPath.length * progress));
            const currentPath = fullPath.slice(0, pointCount);

            if (currentPolyline) currentPolyline.setMap(null);

            currentPolyline = new google.maps.Polyline({
                path: currentPath,
                geodesic: true,
                strokeColor: '#3B82F6',
                strokeOpacity: 0.9,
                strokeWeight: 8,
                map: map
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                routeLineRef.current = currentPolyline;
            }
        };

        requestAnimationFrame(animate);
    };

    // Start real-time GPS navigation
    const startNavigation = () => {
        if (!('geolocation' in navigator)) {
            alert('Geolocation not supported');
            return;
        }
        contextStartNavigation();
    };

    // Expose startNavigation to parent
    useEffect(() => {
        window.startMapNavigation = startNavigation;
        return () => {
            delete window.startMapNavigation;
        };
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full bg-slate-100">
            <div ref={mapContainer} className="absolute inset-0" />

            {/* Loading animator */}
            {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-800 font-black uppercase tracking-widest text-xs">Calibrating Map...</p>
                    </div>
                </div>
            )}

            {/* GPS Pulse Indicator */}
            {isNavigating && !hasArrived && (
                <div className="absolute top-24 left-6 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl z-20 flex items-center space-x-3 border border-white/20 animate-in fade-in slide-in-from-left-5">
                    <div className="relative flex h-5 w-5 bg-white/20 rounded-full items-center justify-center">
                        <span className="text-sm">🚌</span>
                    </div>
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] italic">Jeepney Tracking Active</span>
                </div>
            )}

            {/* LIVE JOURNEY MONITOR (DYNAMIC) */}
            {currentRoute && isNavigating && !hasArrived && (
                <div className="absolute top-24 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-2xl border border-blue-50 z-20 flex flex-col items-end animate-in fade-in slide-in-from-right-5">
                    <span className="text-[0.6rem] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Time to Destination</span>
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl font-black text-slate-800 tracking-tighter italic">{liveDistance || currentRoute.distance}</span>
                        <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">Pending</span>
                    </div>
                </div>
            )}

            {/* WOW ARRIVAL NOTIFICATION */}
            {hasArrived && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-700">
                    <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center border-b-[12px] border-green-500 animate-in zoom-in-90 duration-500 max-w-sm w-full relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-green-50 rounded-full blur-3xl opacity-50"></div>

                        <div className="relative">
                            <div className="w-32 h-32 bg-green-100 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <span className="text-7xl animate-bounce">🎯</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tighter leading-none italic">
                                SUCCESS!<br />ARRIVED
                            </h2>
                            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] mb-10 leading-relaxed italic">
                                "Maraming Salamat Po<br />sa Pag-Tiwala!"
                            </p>
                            <button
                                onClick={() => setHasArrived(false)}
                                className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] shadow-2xl hover:bg-black transition-all active:scale-90 uppercase tracking-[0.3em] text-xs"
                            >
                                Leave Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
