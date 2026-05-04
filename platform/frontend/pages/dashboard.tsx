// Solar Strive Dashboard
// Main interface combining map, jobs, payments, and user management

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { arkade } from '../lib/arkade';

// Dynamic import for map to avoid SSR issues with Mapbox
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
        <p>Loading map...</p>
      </div>
    </div>
  )
});

// Mock data - in production, these would come from API
const mockLocations = [
  {
    id: '1',
    coordinates: [-74.006, 40.7128] as [number, number], // NYC
    businessName: 'Green Coffee Shop',
    address: '123 Solar Street, New York, NY',
    surfaceType: 'cork_board',
    holderType: 'both_formats',
    capacity: 10,
    currentCount: 3,
    availabilityStatus: 'available' as const,
    hourlyRateSats: 50,
    reputationScore: 4.5
  },
  {
    id: '2',
    coordinates: [-118.2437, 34.0522] as [number, number], // LA
    businessName: 'Eco Wellness Center',
    address: '456 Renewable Ave, Los Angeles, CA',
    surfaceType: 'glass_window',
    holderType: 'flyer_only',
    capacity: 5,
    currentCount: 5,
    availabilityStatus: 'occupied' as const,
    hourlyRateSats: 75,
    reputationScore: 4.8
  },
  {
    id: '3',
    coordinates: [-87.6298, 41.8781] as [number, number], // Chicago
    businessName: 'Sustainable Supplies',
    address: '789 Energy Blvd, Chicago, IL',
    surfaceType: 'magnetic_surface',
    holderType: 'business_card_only',
    capacity: 15,
    currentCount: 0,
    availabilityStatus: 'available' as const,
    hourlyRateSats: 25,
    reputationScore: 4.2
  }
];

const mockJobs = [
  {
    id: 'job1',
    locationId: '1',
    jobType: 'placement' as const,
    title: 'Place Solar Flyers at Green Coffee Shop',
    paymentAmountSats: 1000,
    status: 'open' as const,
    coordinates: [-74.006, 40.7128] as [number, number]
  },
  {
    id: 'job2',
    locationId: '3',
    jobType: 'verification' as const,
    title: 'Verify Materials at Sustainable Supplies',
    paymentAmountSats: 250,
    status: 'assigned' as const,
    coordinates: [-87.6298, 41.8781] as [number, number]
  }
];

export default function Dashboard() {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    jobsCompleted: 0,
    reputationScore: 0,
    materialsPlaced: 0
  });

  const [filters, setFilters] = useState({
    availabilityStatus: ['available', 'pending'],
    paymentRange: [0, 1000] as [number, number],
    maxDistance: 50,
    surfaceTypes: [],
    jobTypes: ['placement', 'verification']
  });

  // Initialize Arkade wallet on component mount
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await arkade.initialize();
        const info = await arkade.getWalletInfo();
        setWalletInfo(info);
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      }
    };

    initializeWallet();
  }, []);

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setSelectedJob(null); // Clear job selection when selecting location
  };

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    setSelectedLocation(null); // Clear location selection when selecting job
  };

  const formatSats = (sats: number) => {
    return new Intl.NumberFormat().format(sats);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Solar Strive - Dashboard</title>
        <meta name="description" content="Solar Strive decentralized gig economy platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                ☀️ Solar Strive
              </h1>
              <span className="ml-3 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                Beta
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {walletInfo && (
                <div className="text-sm">
                  <span className="text-gray-600">Balance:</span>
                  <span className="ml-1 font-semibold text-orange-600">
                    ⚡ {formatSats(walletInfo.balance.total)} sats
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>🔗 ArkadeOS</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                ⚡ {formatSats(userStats.totalEarnings)}
              </div>
              <div className="text-sm text-gray-600">Total Earnings (sats)</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {userStats.jobsCompleted}
              </div>
              <div className="text-sm text-gray-600">Jobs Completed</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">
                {userStats.reputationScore.toFixed(1)}⭐
              </div>
              <div className="text-sm text-gray-600">Reputation Score</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600">
                {userStats.materialsPlaced}
              </div>
              <div className="text-sm text-gray-600">Materials Placed</div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                🗺️ Location & Job Map
              </h2>

              <InteractiveMap
                locations={mockLocations}
                jobs={mockJobs}
                filters={filters}
                onLocationSelect={handleLocationSelect}
                onJobSelect={handleJobSelect}
                className="h-96"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Selected Item Details */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">
                {selectedLocation ? '📍 Location Details' : selectedJob ? '💼 Job Details' : '🎯 Select Item'}
              </h3>

              {selectedLocation && (
                <div className="space-y-2 text-sm">
                  <div><strong>{selectedLocation.businessName}</strong></div>
                  <div className="text-gray-600">{selectedLocation.address}</div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="text-orange-600">⚡ {formatSats(selectedLocation.hourlyRateSats)}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span>{selectedLocation.currentCount}/{selectedLocation.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span>{selectedLocation.reputationScore}⭐</span>
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedLocation.availabilityStatus === 'available' ? 'bg-green-100 text-green-800' :
                      selectedLocation.availabilityStatus === 'occupied' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedLocation.availabilityStatus}
                    </span>
                  </div>
                </div>
              )}

              {selectedJob && (
                <div className="space-y-2 text-sm">
                  <div><strong>{selectedJob.title}</strong></div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span className="text-green-600">⚡ {formatSats(selectedJob.paymentAmountSats)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{selectedJob.jobType}</span>
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedJob.status === 'open' ? 'bg-orange-100 text-orange-800' :
                      selectedJob.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedJob.status}
                    </span>
                  </div>

                  {selectedJob.status === 'open' && (
                    <button className="w-full mt-3 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                      Accept Job
                    </button>
                  )}
                </div>
              )}

              {!selectedLocation && !selectedJob && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-2xl mb-2">🗺️</div>
                  <p>Click on a location or job on the map to see details</p>
                </div>
              )}
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">🔍 Filters</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block font-medium mb-1">Payment Range (sats)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={filters.paymentRange[0]}
                      onChange={(e) => setFilters({
                        ...filters,
                        paymentRange: [parseInt(e.target.value) || 0, filters.paymentRange[1]]
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={filters.paymentRange[1]}
                      onChange={(e) => setFilters({
                        ...filters,
                        paymentRange: [filters.paymentRange[0], parseInt(e.target.value) || 1000]
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Max Distance (km)</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({
                      ...filters,
                      maxDistance: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">{filters.maxDistance} km</div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Availability</label>
                  <div className="space-y-1">
                    {['available', 'occupied', 'pending'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.availabilityStatus.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                availabilityStatus: [...filters.availabilityStatus, status]
                              });
                            } else {
                              setFilters({
                                ...filters,
                                availabilityStatus: filters.availabilityStatus.filter(s => s !== status)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-xs capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">⚡ Quick Actions</h3>

              <div className="space-y-2">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600">
                  📍 Add New Location
                </button>
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded text-sm hover:bg-green-600">
                  💼 Create Job
                </button>
                <button className="w-full bg-purple-500 text-white py-2 px-4 rounded text-sm hover:bg-purple-600">
                  📊 View Analytics
                </button>
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded text-sm hover:bg-orange-600">
                  💰 Withdraw Earnings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}