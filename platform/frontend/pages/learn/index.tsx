// Solar Strive Education Hub - Comprehensive Solar Learning Center
// /learn - Main landing page for all educational content

import React, { useState } from 'react';
import { Lightbulb, BookOpen, Calculator, Users, ArrowRight, Sun, Zap, Home, Wrench, TrendingUp, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function LearnIndex() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const learningPaths = [
    {
      id: 'basics',
      title: 'Solar Basics',
      icon: <Sun className="w-8 h-8" />,
      description: 'Start your solar journey with fundamental concepts',
      modules: [
        'How Solar Works',
        'Technology Explained',
        'Cost & Financing',
        'Environmental Impact'
      ],
      difficulty: 'Beginner',
      duration: '2-3 hours',
      color: 'bg-orange-500'
    },
    {
      id: 'advanced',
      title: 'Advanced Topics',
      icon: <Zap className="w-8 h-8" />,
      description: 'Deep dive into technical and business aspects',
      modules: [
        'System Design',
        'Permitting & Regulations',
        'Grid Integration',
        'Energy Storage'
      ],
      difficulty: 'Advanced',
      duration: '6-8 hours',
      color: 'bg-blue-500'
    },
    {
      id: 'homeowner',
      title: 'Homeowner Guide',
      icon: <Home className="w-8 h-8" />,
      description: 'Everything homeowners need to go solar successfully',
      modules: [
        'Is Solar Right for Me?',
        'Choosing Installers',
        'Financing Options',
        'Monitoring & Maintenance'
      ],
      difficulty: 'Beginner',
      duration: '3-4 hours',
      color: 'bg-green-500'
    },
    {
      id: 'solarpreneur',
      title: 'Solarpreneur Training',
      icon: <Users className="w-8 h-8" />,
      description: 'Professional solar education and certification',
      modules: [
        'Solar Sales Fundamentals',
        'Technical Specifications',
        'Customer Objection Handling',
        'Hot Spot Prospecting'
      ],
      difficulty: 'Intermediate',
      duration: '12-15 hours',
      color: 'bg-purple-500'
    }
  ];

  const quickResources = [
    {
      title: 'Solar Calculator',
      description: 'Estimate your savings and payback period',
      icon: <Calculator className="w-6 h-6" />,
      link: '/calculator',
      color: 'text-orange-600'
    },
    {
      title: 'Installer Directory',
      description: 'Find vetted solar professionals near you',
      icon: <Wrench className="w-6 h-6" />,
      link: '/installers',
      color: 'text-blue-600'
    },
    {
      title: 'ROI Analysis',
      description: 'Detailed financial modeling tools',
      icon: <TrendingUp className="w-6 h-6" />,
      link: '/calculator/roi',
      color: 'text-green-600'
    },
    {
      title: 'Environmental Impact',
      description: 'Calculate your carbon footprint reduction',
      icon: <Leaf className="w-6 h-6" />,
      link: '/impact',
      color: 'text-emerald-600'
    }
  ];

  const featuredContent = [
    {
      type: 'Article',
      title: 'Solar Energy Basics: How Solar Panels Work',
      description: 'A comprehensive introduction to photovoltaic technology and solar energy conversion.',
      readTime: '8 min read',
      category: 'Fundamentals',
      link: '/learn/basics/how-solar-works'
    },
    {
      type: 'Video Course',
      title: 'Complete Guide to Solar Financing',
      description: 'Explore loans, leases, PPAs, and cash purchases to find the right solar financing option.',
      readTime: '45 min',
      category: 'Financing',
      link: '/learn/financing/complete-guide'
    },
    {
      type: 'Interactive Tool',
      title: 'Solar System Sizing Calculator',
      description: 'Determine the optimal solar system size for your home based on usage and roof space.',
      readTime: '10 min',
      category: 'Tools',
      link: '/calculator/sizing'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">Solar Education Hub</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Master solar energy from basics to advanced topics. Whether you're a homeowner exploring solar
              or aspiring to become a Solarpreneur, start your learning journey here.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Resources Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Resources</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {quickResources.map((resource, index) => (
              <Link key={index} href={resource.link} className="block">
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200">
                  <div className={resource.color}>
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Structured learning paths designed for different experience levels and goals.
              Progress at your own pace with interactive content and real-world examples.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  selectedPath === path.id ? 'ring-4 ring-orange-400' : ''
                }`}
                onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
              >
                <div className={`${path.color} text-white p-6 text-center`}>
                  {path.icon}
                  <h3 className="text-xl font-bold mt-3">{path.title}</h3>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="bg-white/20 px-2 py-1 rounded">{path.difficulty}</span>
                    <span>{path.duration}</span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{path.description}</p>

                  <div className="space-y-2 mb-4">
                    {path.modules.map((module, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-700">{module}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/learn/${path.id}`} className="block">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                      <span>Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Content */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Content</h2>
            <Link href="/learn/all" className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1">
              <span>View all content</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredContent.map((content, index) => (
              <Link key={index} href={content.link} className="block">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded">
                        {content.type}
                      </span>
                      <span className="text-sm text-gray-500">{content.readTime}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
                    <p className="text-gray-600 mb-4">{content.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{content.category}</span>
                      <ArrowRight className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Community Learning Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Solar Community</h2>
            <p className="text-gray-600 mb-6">
              Connect with other solar enthusiasts, ask questions, share experiences, and learn from
              industry professionals in our community forums.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Join Community
              </Link>
              <Link href="/community/ask" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Ask a Question
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}