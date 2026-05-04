'use client';

// Enhanced Interactive Map Component for Solar Strive
// Includes prospecting mode to identify potential placement locations

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export interface Location {
  id: string;
  coordinates: [number, number];
  businessName: string;
  address: string;
  surfaceType: string;
  holderType: string;
  capacity: number;
  currentCount: number;
  availabilityStatus: 'available' | 'occupied' | 'pending' | 'maintenance';
  hourlyRateSats: number;
  reputationScore: number;
}

export interface Job {
  id: string;
  locationId: string;
  jobType: 'placement' | 'verification' | 'removal';
  title: string;
  paymentAmountSats: number;
  status: 'open' | 'assigned' | 'completed';
  coordinates: [number, number];
}

export interface ProspectLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  address: string;
  businessType: string;
  category: string;
  placementPotential: 'high' | 'medium' | 'low' | 'unknown';
  targetAudience: string;
  accessibilityScore: number;
  visibilityScore: number;
  competitorPresence: boolean;
  phone?: string;
  isDocumented: boolean;
}

export interface MapFilters {
  availabilityStatus: string[];
  paymentRange: [number, number];
  maxDistance: number;
  surfaceTypes: string[];
  jobTypes: string[];
}

export interface ProspectFilters {
  businessTypes: string[];
  minPlacementPotential: 'low' | 'medium' | 'high';
  minVisibilityScore: number;
  onlyUndocumented: boolean;
}

interface InteractiveMapProps {
  locations: Location[];
  jobs: Job[];
  prospects: ProspectLocation[];
  filters: MapFilters;
  prospectFilters: ProspectFilters;
  onLocationSelect: (location: Location) => void;
  onJobSelect: (job: Job) => void;
  onProspectSelect: (prospect: ProspectLocation) => void;
  onProspectingModeChange: (enabled: boolean) => void;
  userLocation?: [number, number];
  className?: string;
}

export default function InteractiveMapWithProspecting({
  locations,
  jobs,
  prospects,
  filters,
  prospectFilters,
  onLocationSelect,
  onJobSelect,
  onProspectSelect,
  onProspectingModeChange,
  userLocation,
  className = ''
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [prospectingMode, setProspectingMode] = useState(false);
  const [loadingProspects, setLoadingProspects] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!mapboxgl.accessToken) {
      console.warn('Mapbox access token not found. Using fallback mode.');
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: prospectingMode ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/light-v11',
      center: userLocation || [-95.7129, 37.0902],
      zoom: userLocation ? 12 : 4,
      attributionControl: false
    });

    // Add controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [userLocation]);

  // Toggle prospecting mode
  const toggleProspectingMode = useCallback(() => {
    const newMode = !prospectingMode;
    setProspectingMode(newMode);
    onProspectingModeChange(newMode);

    if (map.current) {
      // Change map style for prospecting mode
      const style = newMode ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/light-v11';
      map.current.setStyle(style);
    }

    if (newMode) {
      setLoadingProspects(true);
      // Simulate loading prospects
      setTimeout(() => setLoadingProspects(false), 1500);
    }
  }, [prospectingMode, onProspectingModeChange]);

  // Add existing location markers
  useEffect(() => {
    if (!map.current || !mapLoaded || prospectingMode) return;

    const filteredLocations = locations.filter(location => {
      if (filters.availabilityStatus.length > 0 &&
          !filters.availabilityStatus.includes(location.availabilityStatus)) {
        return false;
      }
      if (location.hourlyRateSats < filters.paymentRange[0] ||
          location.hourlyRateSats > filters.paymentRange[1]) {
        return false;
      }
      if (filters.surfaceTypes.length > 0 &&
          !filters.surfaceTypes.includes(location.surfaceType)) {
        return false;
      }
      return true;
    });

    const locationGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredLocations.map(location => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location.coordinates
        },
        properties: {
          ...location,
          type: 'location'
        }
      }))
    };

    // Remove existing layers
    ['clusters', 'cluster-count', 'locations'].forEach(layerId => {
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
    });
    if (map.current.getSource('locations')) {
      map.current.removeSource('locations');
    }

    // Add location source and layers
    map.current.addSource('locations', {
      type: 'geojson',
      data: locationGeoJSON,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    // Cluster layer
    map.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'locations',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1c40f', 30, '#e74c3c'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40]
      }
    });

    // Cluster count
    map.current.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'locations',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    // Individual locations
    map.current.addLayer({
      id: 'locations',
      type: 'circle',
      source: 'locations',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'availabilityStatus'],
          'available', '#27ae60',
          'occupied', '#3498db',
          'pending', '#f39c12',
          'maintenance', '#e74c3c',
          '#95a5a6'
        ],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6, 12, 10, 16, 14],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Click handlers
    map.current.on('click', 'clusters', (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties!.cluster_id;
      const source = map.current!.getSource('locations') as mapboxgl.GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.current!.easeTo({
          center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
          zoom: zoom
        });
      });
    });

    map.current.on('click', 'locations', (e) => {
      const feature = e.features?.[0];
      if (feature) {
        const location = filteredLocations.find(loc => loc.id === feature.properties!.id);
        if (location) onLocationSelect(location);
      }
    });

  }, [locations, filters, mapLoaded, prospectingMode, onLocationSelect]);

  // Add prospect markers when in prospecting mode
  useEffect(() => {
    if (!map.current || !mapLoaded || !prospectingMode) return;

    const filteredProspects = prospects.filter(prospect => {
      if (prospectFilters.businessTypes.length > 0 &&
          !prospectFilters.businessTypes.includes(prospect.businessType)) {
        return false;
      }

      const potentialOrder = ['low', 'medium', 'high'];
      const prospectLevel = potentialOrder.indexOf(prospect.placementPotential);
      const minLevel = potentialOrder.indexOf(prospectFilters.minPlacementPotential);
      if (prospectLevel < minLevel) return false;

      if (prospect.visibilityScore < prospectFilters.minVisibilityScore) return false;
      if (prospectFilters.onlyUndocumented && prospect.isDocumented) return false;

      return true;
    });

    const prospectGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredProspects.map(prospect => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: prospect.coordinates
        },
        properties: {
          ...prospect,
          type: 'prospect'
        }
      }))
    };

    // Remove existing layers
    ['prospects', 'prospect-labels'].forEach(layerId => {
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
    });
    if (map.current.getSource('prospects')) {
      map.current.removeSource('prospects');
    }

    // Add prospect source and layers
    map.current.addSource('prospects', {
      type: 'geojson',
      data: prospectGeoJSON
    });

    // Prospect markers
    map.current.addLayer({
      id: 'prospects',
      type: 'circle',
      source: 'prospects',
      paint: {
        'circle-color': [
          'match',
          ['get', 'placementPotential'],
          'high', '#e74c3c',      // Red for high potential
          'medium', '#f39c12',    // Orange for medium
          'low', '#95a5a6',       // Gray for low
          '#3498db'               // Blue for unknown
        ],
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'accessibilityScore'],
          1, 4,
          10, 12
        ],
        'circle-stroke-width': [
          'case',
          ['get', 'isDocumented'],
          3,  // Thick border for documented
          1   // Thin border for undocumented
        ],
        'circle-stroke-color': [
          'case',
          ['get', 'isDocumented'],
          '#27ae60',  // Green border for documented
          '#ffffff'   // White border for undocumented
        ],
        'circle-opacity': 0.8
      }
    });

    // Prospect labels
    map.current.addLayer({
      id: 'prospect-labels',
      type: 'symbol',
      source: 'prospects',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 10,
        'text-offset': [0, 1.5],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    });

    // Click handler for prospects
    map.current.on('click', 'prospects', (e) => {
      const feature = e.features?.[0];
      if (feature) {
        const prospect = filteredProspects.find(p => p.id === feature.properties!.id);
        if (prospect) onProspectSelect(prospect);
      }
    });

    // Hover effects
    map.current.on('mouseenter', 'prospects', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'prospects', () => {
      map.current!.getCanvas().style.cursor = '';
    });

  }, [prospects, prospectFilters, mapLoaded, prospectingMode, onProspectSelect]);

  // Fallback for missing Mapbox token
  if (!mapboxgl.accessToken) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold mb-2">Map Not Available</h3>
          <p className="text-gray-600 mb-4">Mapbox access token required for interactive map.</p>
          <div className="text-sm text-gray-500">
            <p>Locations: {locations.length} | Jobs: {jobs.length}</p>
            {prospectingMode && <p>Prospects: {prospects.length}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Prospecting Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleProspectingMode}
          className={`px-4 py-2 rounded-lg shadow-lg font-medium transition-all ${
            prospectingMode
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
          disabled={loadingProspects}
        >
          {loadingProspects ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">🔍</span>
              {prospectingMode ? 'Exit Prospecting' : 'Prospecting Mode'}
            </div>
          )}
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full rounded-lg" style={{ minHeight: '400px' }} />

      {/* Mode-specific Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm max-w-xs">
        <h4 className="font-semibold mb-2">
          {prospectingMode ? '🔍 Prospecting Mode' : '📍 Placement Mode'}
        </h4>

        {prospectingMode ? (
          <div className="space-y-1">
            <div className="text-xs text-gray-600 mb-2">Potential Placement Locations</div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>High Potential</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span>Medium Potential</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span>Low Potential</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-3 h-3 rounded-full bg-gray-400 border-2 border-green-500 mr-2"></div>
              <span>Documented</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-xs text-gray-600 mb-2">Current Locations</div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Maintenance</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <div className="space-y-1">
          {prospectingMode ? (
            <>
              <div>🔍 {prospects.length} Prospects Found</div>
              <div>🎯 {prospects.filter(p => p.placementPotential === 'high').length} High Potential</div>
              <div>📋 {prospects.filter(p => !p.isDocumented).length} Undocumented</div>
            </>
          ) : (
            <>
              <div>📍 {locations.length} Locations</div>
              <div>💼 {jobs.length} Jobs</div>
              <div>⚡ {jobs.filter(j => j.status === 'open').length} Open Jobs</div>
            </>
          )}
        </div>
      </div>

      {/* Prospecting Help Overlay */}
      {prospectingMode && (
        <div className="absolute bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm max-w-xs">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">💡</span>
            <div>
              <div className="font-medium text-blue-800">Prospecting Tips</div>
              <div className="text-blue-600 text-xs mt-1">
                Click on red markers for high-potential locations. Document new spots to earn discovery rewards!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}