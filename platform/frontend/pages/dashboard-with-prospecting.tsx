// Enhanced Solar Strive Dashboard with Prospecting Mode
// Includes location discovery, prospect documentation, and intelligence features

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { arkade } from '../lib/arkade';

// Dynamic imports to avoid SSR issues
const InteractiveMapWithProspecting = dynamic(() => import('../components/InteractiveMapWithProspecting'), {
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

const ProspectDocumentationModal = dynamic(() => import('../components/ProspectDocumentationModal'), {
  ssr: false
});

// Mock data for existing locations
const mockLocations = [
  {
    id: '1',
    coordinates: [-74.006, 40.7128] as [number, number],
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
    coordinates: [-118.2437, 34.0522] as [number, number],
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
    coordinates: [-87.6298, 41.8781] as [number, number],
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

// Mock jobs
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

// Mock prospect data
const mockProspects = [
  {
    id: 'prospect1',
    name: 'Sunrise Coffee Roasters',
    coordinates: [-74.0059, 40.7149] as [number, number],
    address: '234 Green St, New York, NY',
    businessType: 'cafe',
    category: 'Coffee Shop',
    placementPotential: 'high' as const,
    targetAudience: 'environmentally_conscious',
    accessibilityScore: 9,
    visibilityScore: 8,
    competitorPresence: false,
    phone: '(555) 123-4567',
    isDocumented: false
  },
  {
    id: 'prospect2',
    name: 'Family Hardware Store',
    coordinates: [-74.0070, 40.7120] as [number, number],
    address: '567 Main St, New York, NY',
    businessType: 'hardware_store',
    category: 'Hardware Store',
    placementPotential: 'high' as const,
    targetAudience: 'homeowners',
    accessibilityScore: 7,
    visibilityScore: 9,
    competitorPresence: true,
    phone: '(555) 987-6543',
    isDocumented: false
  },
  {
    id: 'prospect3',
    name: 'Community Library Branch',
    coordinates: [-74.0080, 40.7100] as [number, number],
    address: '890 Oak Ave, New York, NY',
    businessType: 'library',
    category: 'Library',
    placementPotential: 'medium' as const,
    targetAudience: 'general_public',
    accessibilityScore: 9,
    visibilityScore: 6,
    competitorPresence: false,
    isDocumented: true
  },
  {
    id: 'prospect4',
    name: 'Fresh Market Grocers',
    coordinates: [-74.0090, 40.7080] as [number, number],
    address: '123 Fresh Blvd, New York, NY',
    businessType: 'grocery_store',
    category: 'Grocery Store',
    placementPotential: 'high' as const,
    targetAudience: 'homeowners',
    accessibilityScore: 8,
    visibilityScore: 9,
    competitorPresence: false,
    isDocumented: false
  }
];

export default function DashboardWithProspecting() {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [prospectingMode, setProspectingMode] = useState(false);

  const [userStats, setUserStats] = useState({
    totalEarnings: 2500, // Updated with prospecting earnings
    jobsCompleted: 12,
    reputationScore: 4.3,
    materialsPlaced: 34,
    // New prospecting stats
    prospectsDocumented: 8,
    locationsDiscovered: 3,
    discoveryEarnings: 750
  });

  const [filters, setFilters] = useState({
    availabilityStatus: ['available', 'pending'],
    paymentRange: [0, 1000] as [number, number],
    maxDistance: 50,
    surfaceTypes: [],
    jobTypes: ['placement', 'verification']
  });

  const [prospectFilters, setProspectFilters] = useState({
    businessTypes: ['cafe', 'grocery_store', 'hardware_store'],
    minPlacementPotential: 'medium' as const,
    minVisibilityScore: 5,
    onlyUndocumented: true
  });

  // Initialize Arkade wallet
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
    setSelectedJob(null);
    setSelectedProspect(null);
  };

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    setSelectedLocation(null);
    setSelectedProspect(null);
  };

  const handleProspectSelect = (prospect: any) => {
    setSelectedProspect(prospect);
    setSelectedLocation(null);
    setSelectedJob(null);
  };

  const handleDocumentProspect = () => {
    if (selectedProspect) {
      setShowDocumentationModal(true);
    }
  };

  const handleDocumentationSubmit = async (documentation: any) => {
    console.log('Submitting documentation:', documentation);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update stats
    setUserStats(prev => ({
      ...prev,
      prospectsDocumented: prev.prospectsDocumented + 1,
      locationsDiscovered: documentation.permissionGranted ? prev.locationsDiscovered + 1 : prev.locationsDiscovered,
      discoveryEarnings: prev.discoveryEarnings + (documentation.permissionGranted ? 100 : 25)
    }));

    // Clear selection
    setSelectedProspect(null);
    setShowDocumentationModal(false);
  };

  const formatSats = (sats: number) => {
    return new Intl.NumberFormat().format(sats);
  };

  const getProspectPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Solar Strive - Dashboard with Prospecting</title>
        <meta name="description" content="Solar Strive with intelligent location prospecting" />
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
                Pro
              </span>
              {prospectingMode && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  🔍 Prospecting
                </span>
              )}
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
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              ⚡ {formatSats(userStats.totalEarnings)}
            </div>
            <div className="text-sm text-gray-600">Total Earnings</div>
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
            <div className="text-sm text-gray-600">Reputation</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {userStats.materialsPlaced}
            </div>
            <div className="text-sm text-gray-600">Materials Placed</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {userStats.prospectsDocumented}
            </div>
            <div className="text-sm text-gray-600">Prospects Documented</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-indigo-600">
              ⚡ {formatSats(userStats.discoveryEarnings)}
            </div>
            <div className="text-sm text-gray-600">Discovery Earnings</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                {prospectingMode ? '🔍 Location Prospecting Map' : '🗺️ Location & Job Map'}
              </h2>

              <InteractiveMapWithProspecting
                locations={mockLocations}
                jobs={mockJobs}
                prospects={mockProspects}
                filters={filters}
                prospectFilters={prospectFilters}
                onLocationSelect={handleLocationSelect}
                onJobSelect={handleJobSelect}
                onProspectSelect={handleProspectSelect}
                onProspectingModeChange={setProspectingMode}
                className="h-96"
              />
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Selected Item Details */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">
                {selectedLocation ? '📍 Location Details' :
                 selectedJob ? '💼 Job Details' :
                 selectedProspect ? '🔍 Prospect Details' :
                 '🎯 Select Item'}
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
                  {selectedJob.status === 'open' && (
                    <button className="w-full mt-3 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                      Accept Job
                    </button>
                  )}
                </div>
              )}

              {selectedProspect && (
                <div className="space-y-2 text-sm">
                  <div><strong>{selectedProspect.name}</strong></div>
                  <div className="text-gray-600">{selectedProspect.address}</div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{selectedProspect.businessType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential:</span>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getProspectPotentialColor(selectedProspect.placementPotential)}`}>
                      {selectedProspect.placementPotential}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Score:</span>
                    <span>{selectedProspect.accessibilityScore}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility:</span>
                    <span>{selectedProspect.visibilityScore}/10</span>
                  </div>
                  {selectedProspect.phone && (
                    <div className="text-xs text-gray-500">{selectedProspect.phone}</div>
                  )}

                  <div className="mt-3 space-y-2">
                    {!selectedProspect.isDocumented ? (
                      <button
                        onClick={handleDocumentProspect}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-sm"
                      >
                        📝 Document Location
                      </button>
                    ) : (
                      <div className="text-center text-green-600 text-sm font-medium">
                        ✅ Already Documented
                      </div>
                    )}

                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm">
                      📞 Contact Business
                    </button>
                  </div>
                </div>
              )}

              {!selectedLocation && !selectedJob && !selectedProspect && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-2xl mb-2">
                    {prospectingMode ? '🔍' : '🗺️'}
                  </div>
                  <p className="text-sm">
                    {prospectingMode
                      ? 'Click on a prospect to document it'
                      : 'Click on a location or job to see details'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Prospecting Controls */}
            {prospectingMode && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">🔍 Prospect Filters</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block font-medium mb-1">Business Types</label>
                    <div className="space-y-1">
                      {['cafe', 'grocery_store', 'hardware_store', 'library'].map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={prospectFilters.businessTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProspectFilters({
                                  ...prospectFilters,
                                  businessTypes: [...prospectFilters.businessTypes, type]
                                });
                              } else {
                                setProspectFilters({
                                  ...prospectFilters,
                                  businessTypes: prospectFilters.businessTypes.filter(t => t !== type)
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-xs capitalize">{type.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Min Potential</label>
                    <select
                      value={prospectFilters.minPlacementPotential}
                      onChange={(e) => setProspectFilters({
                        ...prospectFilters,
                        minPlacementPotential: e.target.value as any
                      })}
                      className="w-full text-xs border rounded px-2 py-1"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={prospectFilters.onlyUndocumented}
                        onChange={(e) => setProspectFilters({
                          ...prospectFilters,
                          onlyUndocumented: e.target.checked
                        })}
                        className="mr-2"
                      />
                      <span className="text-xs">Only undocumented</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Filter Controls */}
            {!prospectingMode && (
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
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">⚡ Quick Actions</h3>

              <div className="space-y-2">
                {prospectingMode ? (
                  <>
                    <button className="w-full bg-red-500 text-white py-2 px-4 rounded text-sm hover:bg-red-600">
                      🔍 Find More Prospects
                    </button>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded text-sm hover:bg-green-600">
                      📊 Prospecting Report
                    </button>
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600">
                      💰 Discovery Earnings
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600">
                      📍 Add Location
                    </button>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded text-sm hover:bg-green-600">
                      💼 Create Job
                    </button>
                    <button className="w-full bg-purple-500 text-white py-2 px-4 rounded text-sm hover:bg-purple-600">
                      📊 Analytics
                    </button>
                    <button className="w-full bg-orange-500 text-white py-2 px-4 rounded text-sm hover:bg-orange-600">
                      💰 Withdraw
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Modal */}
      <ProspectDocumentationModal
        prospect={selectedProspect}
        isOpen={showDocumentationModal}
        onClose={() => setShowDocumentationModal(false)}
        onSubmit={handleDocumentationSubmit}
      />
    </div>
  );
}