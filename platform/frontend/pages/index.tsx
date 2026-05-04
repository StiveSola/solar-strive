// Solar Strive - Main Website Homepage
// Comprehensive solar education and services platform with Hot Spot integration

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic components to avoid SSR issues
const InteractiveMapWithProspecting = dynamic(() => import('../components/InteractiveMapWithProspecting'), {
  ssr: false
});

const SolarCalculator = dynamic(() => import('../components/SolarCalculator'), {
  ssr: false
});

export default function HomePage() {
  const [userType, setUserType] = useState<'consumer' | 'solarpreneur' | 'partner' | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    installations: 0,
    savings: 0,
    solarpreneurs: 0,
    hotspots: 0
  });

  // Animated counter for stats
  useEffect(() => {
    const targets = { installations: 2847, savings: 1250000, solarpreneurs: 156, hotspots: 423 };
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);

      setAnimatedStats({
        installations: Math.floor(targets.installations * progress),
        savings: Math.floor(targets.savings * progress),
        solarpreneurs: Math.floor(targets.solarpreneurs * progress),
        hotspots: Math.floor(targets.hotspots * progress)
      });

      if (progress >= 1) clearInterval(timer);
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <Head>
        <title>Solar Strive - Solar in Every Deserving Place</title>
        <meta name="description" content="Comprehensive solar education, installation services, and community-powered lead generation through our innovative Hot Spot network." />
        <meta name="keywords" content="solar energy, solar panels, solar installation, solar education, renewable energy, hot spots, solarpreneurs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">
                ☀️ Solar Strive
              </div>
              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Solar in Every Place
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link href="/learn" className="text-gray-700 hover:text-orange-600 font-medium">
                Learn Solar
              </Link>
              <Link href="/calculator" className="text-gray-700 hover:text-orange-600 font-medium">
                Calculator
              </Link>
              <Link href="/installers" className="text-gray-700 hover:text-orange-600 font-medium">
                Find Installers
              </Link>
              <Link href="/hot-spots" className="text-gray-700 hover:text-orange-600 font-medium">
                Hot Spot Network
              </Link>
              <Link href="/lots-of-solar" className="text-gray-700 hover:text-orange-600 font-medium">
                #LotsOfSolar
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex space-x-3">
              <Link href="/join" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium">
                Become Solarpreneur
              </Link>
              <Link href="/get-started" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium">
                Go Solar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-orange-600">Solar</span> in Every{' '}
              <span className="text-green-600">Deserving Place</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Bridging real-world promotion with digital innovation to accelerate solar adoption,
              empower local communities, and create opportunities for everyone.
            </p>

            {/* User Type Selection */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button
                onClick={() => setUserType('consumer')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  userType === 'consumer'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50'
                }`}
              >
                🏠 I Want Solar
              </button>

              <button
                onClick={() => setUserType('solarpreneur')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  userType === 'solarpreneur'
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-orange-500 border-2 border-orange-500 hover:bg-orange-50'
                }`}
              >
                ⚡ I Want to Earn Bitcoin
              </button>

              <button
                onClick={() => setUserType('partner')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  userType === 'partner'
                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-green-500 border-2 border-green-500 hover:bg-green-50'
                }`}
              >
                🤝 I Want to Partner
              </button>
            </div>
          </div>
        </div>

        {/* Background Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 bg-green-200 rounded-full opacity-25 animate-pulse"></div>
        </div>
      </section>

      {/* Dynamic Content Based on User Type */}
      {userType === 'consumer' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Solar Journey Starts Here
              </h2>
              <p className="text-xl text-gray-600">
                Learn, calculate, and connect with trusted local installers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Learn */}
              <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-3">Learn Solar Basics</h3>
                <p className="text-gray-600 mb-4">
                  Understand how solar works, costs, savings, and benefits through our comprehensive education hub.
                </p>
                <Link href="/learn" className="text-blue-600 font-medium hover:text-blue-700">
                  Start Learning →
                </Link>
              </div>

              {/* Calculate */}
              <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="text-4xl mb-4">🧮</div>
                <h3 className="text-xl font-semibold mb-3">Calculate Savings</h3>
                <p className="text-gray-600 mb-4">
                  Get personalized estimates for system size, costs, and savings based on your specific situation.
                </p>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="text-green-600 font-medium hover:text-green-700"
                >
                  Calculate Now →
                </button>
              </div>

              {/* Connect */}
              <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                <div className="text-4xl mb-4">🔌</div>
                <h3 className="text-xl font-semibold mb-3">Connect with Installers</h3>
                <p className="text-gray-600 mb-4">
                  Find vetted, local solar professionals who can design and install your perfect system.
                </p>
                <Link href="/installers" className="text-orange-600 font-medium hover:text-orange-700">
                  Find Installers →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {userType === 'solarpreneur' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Earn Bitcoin Spreading Solar
              </h2>
              <p className="text-xl text-gray-600">
                Join our network of Solarpreneurs and earn through education, referrals, and Hot Spot placements
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Training */}
              <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold mb-3">Solar School</h3>
                <p className="text-gray-600 mb-4">
                  Get certified in solar basics, sales techniques, and technical knowledge through our structured curriculum.
                </p>
                <Link href="/training" className="text-purple-600 font-medium hover:text-purple-700">
                  Start Training →
                </Link>
              </div>

              {/* Hot Spots */}
              <div className="text-center p-6 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3">Hot Spot Network</h3>
                <p className="text-gray-600 mb-4">
                  Discover and document potential placement locations. Earn Bitcoin for successful prospect documentation.
                </p>
                <Link href="/dashboard-with-prospecting" className="text-red-600 font-medium hover:text-red-700">
                  Start Prospecting →
                </Link>
              </div>

              {/* Earnings */}
              <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-3">Lightning Earnings</h3>
                <p className="text-gray-600 mb-4">
                  Get paid instantly in Bitcoin for referrals, placements, and educational content through Lightning Network.
                </p>
                <Link href="/earnings" className="text-orange-600 font-medium hover:text-orange-700">
                  Track Earnings →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {userType === 'partner' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Partner for Community Impact
              </h2>
              <p className="text-xl text-gray-600">
                Join businesses, organizations, and advocates accelerating solar adoption
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Lots of Solar */}
              <div className="text-center p-6 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors">
                <div className="text-4xl mb-4">🅿️</div>
                <h3 className="text-xl font-semibold mb-3">#LotsOfSolar</h3>
                <p className="text-gray-600 mb-4">
                  Transform parking lots into solar canopy installations. Connect property owners with solar developers.
                </p>
                <Link href="/lots-of-solar" className="text-yellow-600 font-medium hover:text-yellow-700">
                  Learn More →
                </Link>
              </div>

              {/* Community Solar */}
              <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="text-4xl mb-4">🏘️</div>
                <h3 className="text-xl font-semibold mb-3">Community Solar</h3>
                <p className="text-gray-600 mb-4">
                  Enable virtual net metering programs for renters and those without suitable roofs.
                </p>
                <Link href="/community-solar" className="text-green-600 font-medium hover:text-green-700">
                  Explore Programs →
                </Link>
              </div>

              {/* Business Partners */}
              <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3">Business Network</h3>
                <p className="text-gray-600 mb-4">
                  Join our installer network, become a Hot Spot location, or partner on community initiatives.
                </p>
                <Link href="/partners" className="text-blue-600 font-medium hover:text-blue-700">
                  Partner with Us →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hot Spot Network Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Hot Spot Network
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Revolutionary lead generation through real-world information placement
            </p>
          </div>

          {/* Hot Spot Map Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <InteractiveMapWithProspecting
              locations={[]}
              jobs={[]}
              prospects={[]}
              filters={{ availabilityStatus: [], paymentRange: [0, 1000], maxDistance: 50, surfaceTypes: [], jobTypes: [] }}
              prospectFilters={{ businessTypes: [], minPlacementPotential: 'medium', minVisibilityScore: 5, onlyUndocumented: true }}
              onLocationSelect={() => {}}
              onJobSelect={() => {}}
              onProspectSelect={() => {}}
              onProspectingModeChange={() => {}}
              className="h-96"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-3">Strategic Placement</h3>
              <p className="text-gray-600">
                AI-powered location intelligence identifies high-potential cafes, stores, and community centers.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">QR Attribution</h3>
              <p className="text-gray-600">
                Every scan is tracked and attributed, creating transparent revenue sharing across the network.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Bitcoin Rewards</h3>
              <p className="text-gray-600">
                Instant Lightning Network payments for discoveries, placements, and successful conversions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Growing Solar Adoption
            </h2>
            <p className="text-xl opacity-90">
              Real impact through community-powered solar education
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {formatNumber(animatedStats.installations)}
              </div>
              <div className="text-lg opacity-90">Solar Installations Referred</div>
            </div>

            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                ${formatNumber(animatedStats.savings)}
              </div>
              <div className="text-lg opacity-90">Customer Savings Generated</div>
            </div>

            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {formatNumber(animatedStats.solarpreneurs)}
              </div>
              <div className="text-lg opacity-90">Active Solarpreneurs</div>
            </div>

            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {formatNumber(animatedStats.hotspots)}
              </div>
              <div className="text-lg opacity-90">Hot Spot Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Join the Solar Revolution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you want to go solar, earn Bitcoin, or partner with us,
            there's a place for you in the Solar Strive community.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/get-started"
              className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              🏠 Go Solar Today
            </Link>

            <Link
              href="/join"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              ⚡ Become a Solarpreneur
            </Link>

            <Link
              href="/partners"
              className="bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              🤝 Partner with Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <div className="text-xl font-bold mb-4">☀️ Solar Strive</div>
              <p className="text-gray-400 mb-4">
                Solar in every deserving place through education, innovation, and community.
              </p>
              <div className="text-sm text-gray-500">
                Powered by Bitcoin & Lightning Network
              </div>
            </div>

            {/* Learn */}
            <div>
              <h3 className="font-semibold mb-4">Learn Solar</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="/learn/basics" className="block hover:text-white">Solar Basics</Link>
                <Link href="/learn/financing" className="block hover:text-white">Financing Options</Link>
                <Link href="/learn/installation" className="block hover:text-white">Installation Process</Link>
                <Link href="/calculator" className="block hover:text-white">Savings Calculator</Link>
              </div>
            </div>

            {/* Network */}
            <div>
              <h3 className="font-semibold mb-4">Network</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="/installers" className="block hover:text-white">Find Installers</Link>
                <Link href="/hot-spots" className="block hover:text-white">Hot Spot Network</Link>
                <Link href="/community" className="block hover:text-white">Community</Link>
                <Link href="/lots-of-solar" className="block hover:text-white">#LotsOfSolar</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="/about" className="block hover:text-white">About Us</Link>
                <Link href="/careers" className="block hover:text-white">Careers</Link>
                <Link href="/press" className="block hover:text-white">Press</Link>
                <Link href="/contact" className="block hover:text-white">Contact</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Solar Strive. All rights reserved. | Building the circular economy with Bitcoin.</p>
          </div>
        </div>
      </footer>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <SolarCalculator onClose={() => setShowCalculator(false)} />
          </div>
        </div>
      )}
    </div>
  );
}