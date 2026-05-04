// Solar Strive - Installer Network Directory
// Vetted solar professional directory with matching and reviews

import React, { useState } from 'react';
import { Search, MapPin, Star, Award, Phone, Mail, Globe, Filter, ChevronDown, Users, Zap, Shield } from 'lucide-react';

export default function InstallersDirectory() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'financing', label: 'Offers Financing' },
    { id: 'maintenance', label: 'Maintenance Services' },
    { id: 'storage', label: 'Battery Storage' },
    { id: 'certified', label: 'Certified Installers' }
  ];

  const installers = [
    {
      id: 1,
      name: 'SunPower Solutions',
      description: 'Premier residential solar installer with 15+ years experience',
      rating: 4.9,
      reviewCount: 247,
      location: 'Denver, CO',
      distance: '2.3 miles',
      specialties: ['Residential', 'Battery Storage', 'Smart Home Integration'],
      certifications: ['NABCEP Certified', 'Tesla Powerwall Certified'],
      installsCompleted: 1200,
      yearsInBusiness: 15,
      phone: '(555) 123-4567',
      email: 'info@sunpowersolutions.com',
      website: 'www.sunpowersolutions.com',
      logo: '/api/placeholder/80/80',
      verified: true,
      offersTour: true,
      financing: true,
      warranty: '25 years',
      responseTime: '< 24 hours'
    },
    {
      id: 2,
      name: 'Rocky Mountain Solar',
      description: 'Local family-owned business specializing in custom solar solutions',
      rating: 4.8,
      reviewCount: 189,
      location: 'Boulder, CO',
      distance: '8.1 miles',
      specialties: ['Residential', 'Commercial', 'Ground Mount'],
      certifications: ['NABCEP Certified', 'SolarEdge Certified'],
      installsCompleted: 850,
      yearsInBusiness: 12,
      phone: '(555) 987-6543',
      email: 'contact@rockymountainsolar.com',
      website: 'www.rockymountainsolar.com',
      logo: '/api/placeholder/80/80',
      verified: true,
      offersTour: false,
      financing: true,
      warranty: '20 years',
      responseTime: '< 48 hours'
    },
    {
      id: 3,
      name: 'Colorado Energy Experts',
      description: 'Full-service renewable energy company with solar and storage solutions',
      rating: 4.7,
      reviewCount: 156,
      location: 'Lakewood, CO',
      distance: '12.5 miles',
      specialties: ['Residential', 'Energy Storage', 'EV Charging'],
      certifications: ['NABCEP Certified', 'Enphase Certified'],
      installsCompleted: 650,
      yearsInBusiness: 8,
      phone: '(555) 246-8135',
      email: 'hello@coloradoenergyexperts.com',
      website: 'www.coloradoenergyexperts.com',
      logo: '/api/placeholder/80/80',
      verified: true,
      offersTour: true,
      financing: false,
      warranty: '25 years',
      responseTime: '< 24 hours'
    },
    {
      id: 4,
      name: 'Mile High Solar',
      description: 'Innovative solar solutions with focus on energy independence',
      rating: 4.6,
      reviewCount: 203,
      location: 'Westminster, CO',
      distance: '15.2 miles',
      specialties: ['Residential', 'Off-Grid', 'Custom Design'],
      certifications: ['NABCEP Certified'],
      installsCompleted: 950,
      yearsInBusiness: 10,
      phone: '(555) 369-2580',
      email: 'info@milehighsolar.com',
      website: 'www.milehighsolar.com',
      logo: '/api/placeholder/80/80',
      verified: false,
      offersTour: false,
      financing: true,
      warranty: '20 years',
      responseTime: '< 72 hours'
    }
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Solar Installer Directory</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find vetted, certified solar professionals in your area. All installers are pre-screened
              for quality, licensing, and customer satisfaction.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your address or ZIP code"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {selectedFilters.map((filter) => {
                const option = filterOptions.find(opt => opt.id === filter);
                return (
                  <span
                    key={filter}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {option?.label}
                    <button
                      onClick={() => toggleFilter(filter)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="distance">Closest</option>
                <option value="experience">Most Experienced</option>
                <option value="installs">Most Installs</option>
              </select>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Filter by Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {filterOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(option.id)}
                      onChange={() => toggleFilter(option.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {installers.length} verified installers near your location
          </p>
        </div>

        {/* Installer Cards */}
        <div className="space-y-6">
          {installers.map((installer) => (
            <div key={installer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                  {/* Logo and Basic Info */}
                  <div className="flex items-start space-x-4 lg:flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={installer.logo} alt={installer.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900">{installer.name}</h3>
                        {installer.verified && (
                          <Shield className="w-5 h-5 text-green-600" title="Verified Installer" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{installer.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{installer.location} • {installer.distance}</span>
                        </span>
                        <span>Response: {installer.responseTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="lg:flex-shrink-0">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">{installer.rating}</span>
                      <span className="text-gray-500">({installer.reviewCount} reviews)</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {installer.installsCompleted} installs • {installer.yearsInBusiness} years
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="lg:ml-auto lg:flex-shrink-0">
                    <div className="flex flex-col space-y-2">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Get Quote
                      </button>
                      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                      <div className="space-y-1">
                        {installer.specialties.map((specialty, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
                      <div className="space-y-1">
                        {installer.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
                            <Award className="w-3 h-3 text-green-600" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span className={installer.financing ? 'text-green-600' : 'text-gray-400'}>●</span>
                          <span>Financing Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={installer.offersTour ? 'text-green-600' : 'text-gray-400'}>●</span>
                          <span>Site Tours</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">●</span>
                          <span>{installer.warranty} Warranty</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{installer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{installer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Globe className="w-3 h-3" />
                          <span>{installer.website}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Load More Installers
          </button>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Are You a Solar Professional?</h2>
            <p className="text-gray-600 mb-6">
              Join our network of vetted solar installers and connect with qualified customers in your area.
              Grow your business with Solar Strive's lead generation platform.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Apply to Join Network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}