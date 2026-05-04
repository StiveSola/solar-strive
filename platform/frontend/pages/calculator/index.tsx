// Solar Strive - Comprehensive Solar Calculator Suite
// Main calculator landing page with multiple calculation tools

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Zap, Home, TrendingUp, Leaf, ArrowRight, MapPin, Sun } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorIndex() {
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');

  const calculators = [
    {
      id: 'savings',
      title: 'Solar Savings Calculator',
      description: 'Estimate monthly and lifetime savings from solar panels',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      features: [
        'Monthly bill analysis',
        'Federal & state incentives',
        'Payback period calculation',
        'Lifetime savings projection'
      ],
      accuracy: 'High',
      duration: '5 min',
      difficulty: 'Easy',
      path: '/calculator/savings'
    },
    {
      id: 'sizing',
      title: 'System Sizing Calculator',
      description: 'Determine optimal solar system size for your energy needs',
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      features: [
        'Energy usage analysis',
        'Roof space assessment',
        'Panel configuration',
        'Production modeling'
      ],
      accuracy: 'Very High',
      duration: '8 min',
      difficulty: 'Medium',
      path: '/calculator/sizing'
    },
    {
      id: 'roi',
      title: 'ROI Analysis Tool',
      description: 'Detailed financial modeling and return on investment',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      features: [
        'Cash flow analysis',
        'Financing comparisons',
        'Tax benefit modeling',
        'Investment scenarios'
      ],
      accuracy: 'Very High',
      duration: '12 min',
      difficulty: 'Advanced',
      path: '/calculator/roi'
    },
    {
      id: 'offset',
      title: 'Energy Offset Calculator',
      description: 'Calculate how much of your energy use solar can offset',
      icon: <Home className="w-8 h-8" />,
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      features: [
        'Bill upload analysis',
        'Seasonal variations',
        'Net metering impact',
        'Grid independence score'
      ],
      accuracy: 'High',
      duration: '6 min',
      difficulty: 'Easy',
      path: '/calculator/offset'
    },
    {
      id: 'environmental',
      title: 'Environmental Impact',
      description: 'Calculate carbon footprint reduction and environmental benefits',
      icon: <Leaf className="w-8 h-8" />,
      color: 'bg-emerald-500',
      borderColor: 'border-emerald-500',
      features: [
        'CO2 reduction calculation',
        'Equivalent tree planting',
        'Air quality improvement',
        'Resource conservation'
      ],
      accuracy: 'High',
      duration: '4 min',
      difficulty: 'Easy',
      path: '/calculator/environmental'
    },
    {
      id: 'financing',
      title: 'Financing Comparison',
      description: 'Compare cash, loan, lease, and PPA options',
      icon: <Calculator className="w-8 h-8" />,
      color: 'bg-indigo-500',
      borderColor: 'border-indigo-500',
      features: [
        'Payment option comparison',
        'Total cost analysis',
        'Ownership benefits',
        'Tax implications'
      ],
      accuracy: 'High',
      duration: '10 min',
      difficulty: 'Medium',
      path: '/calculator/financing'
    }
  ];

  const quickStats = [
    { label: 'Average Savings', value: '$1,400/year', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Typical Payback', value: '6-8 years', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'CO2 Reduction', value: '3.5 tons/year', icon: <Leaf className="w-5 h-5" /> },
    { label: 'System Lifespan', value: '25+ years', icon: <Sun className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Calculator className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">Solar Calculator Suite</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Get accurate estimates for solar savings, system sizing, and return on investment.
              Our comprehensive calculators use real-time data and local incentives.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex justify-center text-blue-200 mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Location Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Location</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Enter your location to get accurate solar irradiance data and local incentive information.
          </p>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter your address or ZIP code"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Update Location
            </button>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {calculators.map((calculator) => (
            <div
              key={calculator.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedCalculator === calculator.id ? `ring-4 ${calculator.borderColor.replace('border-', 'ring-')}` : ''
              }`}
              onClick={() => setSelectedCalculator(selectedCalculator === calculator.id ? null : calculator.id)}
            >
              <div className={`${calculator.color} text-white p-6 text-center`}>
                {calculator.icon}
                <h3 className="text-xl font-bold mt-3">{calculator.title}</h3>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <span className="bg-white/20 px-2 py-1 rounded">{calculator.difficulty}</span>
                  <span>{calculator.duration}</span>
                  <span className="bg-white/20 px-2 py-1 rounded">{calculator.accuracy}</span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{calculator.description}</p>

                <div className="space-y-2 mb-6">
                  {calculator.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={calculator.path} className="block">
                  <button className={`w-full ${calculator.color} hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2`}>
                    <span>Start Calculation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Get Started</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start with Savings</h3>
              <p className="text-gray-600">
                Use the Solar Savings Calculator to get a quick estimate of potential savings and see if solar makes sense for you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Size Your System</h3>
              <p className="text-gray-600">
                Use the System Sizing Calculator to determine how many panels you'll need and how they'll fit on your roof.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analyze Financing</h3>
              <p className="text-gray-600">
                Compare different payment options with our financing tools to find the best financial structure for your situation.
              </p>
            </div>
          </div>
        </div>

        {/* Professional Consultation CTA */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Sun className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Professional Guidance?</h2>
            <p className="text-gray-600 mb-6">
              While our calculators provide accurate estimates, every home is unique. Connect with vetted solar
              professionals for a detailed assessment and custom system design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/installers" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Find Local Installers
              </Link>
              <Link href="/consultation" className="bg-white hover:bg-gray-50 text-orange-600 border border-orange-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Schedule Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}