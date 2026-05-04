'use client';

// Interactive Map Component for Solar Strive
// Displays locations, jobs, and handles real-time updates

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export interface Location {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
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

export interface MapFilters {
  availabilityStatus: string[];
  paymentRange: [number, number];
  maxDistance: number; // kilometers
  surfaceTypes: string[];
  jobTypes: string[];
}

interface InteractiveMapProps {
  locations: Location[];
  jobs: Job[];
  filters: MapFilters;
  onLocationSelect: (location: Location) => void;
  onJobSelect: (job: Job) => void;
  userLocation?: [number, number];
  className?: string;
}

export default function InteractiveMap({
  locations,
  jobs,
  filters,
  onLocationSelect,
  onJobSelect,
  userLocation,
  className = ''
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check if Mapbox token is available
    if (!mapboxgl.accessToken) {
      console.warn('Mapbox access token not found. Map functionality will be limited.');
      return;
    }

    // VA/MD/DC region bounds
    const bounds = new mapboxgl.LngLatBounds(
      [-79.5, 36.5], // Southwest coordinates (SW Virginia)
      [-75.0, 39.7]  // Northeast coordinates (NE Maryland)
    );

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation || [-77.0369, 38.9072], // DC as default center
      zoom: userLocation ? 12 : 7,
      maxBounds: bounds, // Restrict map to VA/MD/DC region
      minZoom: 6,
      maxZoom: 18,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocation control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
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

  // Add location markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Filter locations based on current filters
    const filteredLocations = locations.filter(location => {
      // Filter by availability status
      if (filters.availabilityStatus.length > 0 &&
          !filters.availabilityStatus.includes(location.availabilityStatus)) {
        return false;
      }

      // Filter by payment range
      if (location.hourlyRateSats < filters.paymentRange[0] ||
          location.hourlyRateSats > filters.paymentRange[1]) {
        return false;
      }

      // Filter by surface type
      if (filters.surfaceTypes.length > 0 &&
          !filters.surfaceTypes.includes(location.surfaceType)) {
        return false;
      }

      return true;
    });

    // Create GeoJSON for locations
    const locationGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredLocations.map(location => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location.coordinates
        },
        properties: {
          id: location.id,
          businessName: location.businessName,
          address: location.address,
          surfaceType: location.surfaceType,
          holderType: location.holderType,
          capacity: location.capacity,
          currentCount: location.currentCount,
          availabilityStatus: location.availabilityStatus,
          hourlyRateSats: location.hourlyRateSats,
          reputationScore: location.reputationScore,
          type: 'location'
        }
      }))
    };

    // Remove existing location layers and sources
    if (map.current.getLayer('locations')) {
      map.current.removeLayer('locations');
    }
    if (map.current.getSource('locations')) {
      map.current.removeSource('locations');
    }

    // Add location source and layer
    map.current.addSource('locations', {
      type: 'geojson',
      data: locationGeoJSON,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    // Add clusters layer
    map.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'locations',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          10,
          '#f1c40f',
          30,
          '#e74c3c'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          10,
          30,
          30,
          40
        ]
      }
    });

    // Add cluster count labels
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

    // Add individual location points
    map.current.addLayer({
      id: 'locations',
      type: 'circle',
      source: 'locations',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'availabilityStatus'],
          'available', '#27ae60',      // Green
          'occupied', '#3498db',       // Blue
          'pending', '#f39c12',        // Orange
          'maintenance', '#e74c3c',    // Red
          '#95a5a6'                    // Gray default
        ],
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 4,
          12, 8,
          16, 12
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Click handlers for clusters and locations
    map.current.on('click', 'clusters', (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });

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
        if (location) {
          onLocationSelect(location);
        }
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'clusters', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'clusters', () => {
      map.current!.getCanvas().style.cursor = '';
    });
    map.current.on('mouseenter', 'locations', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'locations', () => {
      map.current!.getCanvas().style.cursor = '';
    });

  }, [locations, filters, mapLoaded, onLocationSelect]);

  // Add job markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Filter jobs based on current filters
    const filteredJobs = jobs.filter(job => {
      return filters.jobTypes.length === 0 || filters.jobTypes.includes(job.jobType);
    });

    // Create GeoJSON for jobs
    const jobGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredJobs.map(job => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: job.coordinates
        },
        properties: {
          id: job.id,
          locationId: job.locationId,
          jobType: job.jobType,
          title: job.title,
          paymentAmountSats: job.paymentAmountSats,
          status: job.status,
          type: 'job'
        }
      }))
    };

    // Remove existing job layers and sources
    if (map.current.getLayer('jobs')) {
      map.current.removeLayer('jobs');
    }
    if (map.current.getSource('jobs')) {
      map.current.removeSource('jobs');
    }

    // Add job source and layer
    map.current.addSource('jobs', {
      type: 'geojson',
      data: jobGeoJSON
    });

    map.current.addLayer({
      id: 'jobs',
      type: 'symbol',
      source: 'jobs',
      layout: {
        'icon-image': [
          'match',
          ['get', 'jobType'],
          'placement', 'marker-15',
          'verification', 'circle-15',
          'removal', 'triangle-15',
          'marker-15'
        ],
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 0.5,
          12, 0.8,
          16, 1
        ],
        'icon-allow-overlap': false
      },
      paint: {
        'icon-color': [
          'match',
          ['get', 'status'],
          'open', '#f39c12',      // Orange
          'assigned', '#3498db',  // Blue
          'completed', '#27ae60', // Green
          '#95a5a6'               // Gray default
        ]
      }
    });

    // Click handler for jobs
    map.current.on('click', 'jobs', (e) => {
      const feature = e.features?.[0];
      if (feature) {
        const job = filteredJobs.find(j => j.id === feature.properties!.id);
        if (job) {
          onJobSelect(job);
        }
      }
    });

    // Hover effects
    map.current.on('mouseenter', 'jobs', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'jobs', () => {
      map.current!.getCanvas().style.cursor = '';
    });

  }, [jobs, filters, mapLoaded, onJobSelect]);

  // Fallback for when Mapbox is not available
  if (!mapboxgl.accessToken) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold mb-2">Map Not Available</h3>
          <p className="text-gray-600 mb-4">
            Mapbox access token is required for the interactive map.
          </p>
          <div className="text-sm text-gray-500">
            <p>Showing {locations.length} locations and {jobs.length} jobs</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <h4 className="font-semibold mb-2">Location Status</h4>
        <div className="space-y-1">
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
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <div className="space-y-1">
          <div>📍 {locations.length} Locations</div>
          <div>💼 {jobs.length} Jobs</div>
          <div>⚡ {jobs.filter(j => j.status === 'open').length} Open Jobs</div>
        </div>
      </div>
    </div>
  );
}