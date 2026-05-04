// Solar Strive - Solar Basics Learning Path
// Comprehensive introduction to solar energy fundamentals

import React, { useState } from 'react';
import { Sun, Zap, DollarSign, Leaf, CheckCircle, Clock, ArrowRight, ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';

export default function SolarBasics() {
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [currentModule, setCurrentModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'how-solar-works',
      title: 'How Solar Works',
      description: 'Learn the science behind solar panels and energy conversion',
      duration: '15 min',
      icon: <Sun className="w-6 h-6" />,
      topics: [
        'Photovoltaic Effect',
        'Solar Cell Structure',
        'DC to AC Conversion',
        'Grid Connection'
      ],
      prerequisites: [],
      learningOutcomes: [
        'Understand how sunlight becomes electricity',
        'Identify key solar system components',
        'Explain the role of inverters'
      ]
    },
    {
      id: 'technology-explained',
      title: 'Technology Explained',
      description: 'Different types of solar technology and their applications',
      duration: '20 min',
      icon: <Zap className="w-6 h-6" />,
      topics: [
        'Monocrystalline vs Polycrystalline',
        'Thin Film Solar',
        'Bifacial Panels',
        'Microinverters vs String Inverters'
      ],
      prerequisites: ['how-solar-works'],
      learningOutcomes: [
        'Compare different panel technologies',
        'Choose appropriate technology for your needs',
        'Understand inverter options'
      ]
    },
    {
      id: 'cost-financing',
      title: 'Cost & Financing',
      description: 'Understanding solar costs, incentives, and financing options',
      duration: '25 min',
      icon: <DollarSign className="w-6 h-6" />,
      topics: [
        'System Pricing Factors',
        'Federal Tax Credit',
        'State Incentives',
        'Financing Options'
      ],
      prerequisites: [],
      learningOutcomes: [
        'Calculate total solar investment',
        'Identify available incentives',
        'Compare financing methods'
      ]
    },
    {
      id: 'environmental-impact',
      title: 'Environmental Impact',
      description: 'Solar energy benefits for the environment and society',
      duration: '18 min',
      icon: <Leaf className="w-6 h-6" />,
      topics: [
        'Carbon Footprint Reduction',
        'Manufacturing Impact',
        'End-of-Life Recycling',
        'Grid Independence Benefits'
      ],
      prerequisites: ['how-solar-works'],
      learningOutcomes: [
        'Quantify environmental benefits',
        'Understand lifecycle impact',
        'Recognize societal benefits'
      ]
    }
  ];

  const toggleModuleCompletion = (moduleId: string) => {
    const newCompleted = new Set(completedModules);
    if (newCompleted.has(moduleId)) {
      newCompleted.delete(moduleId);
    } else {
      newCompleted.add(moduleId);
    }
    setCompletedModules(newCompleted);
  };

  const getModuleStatus = (module: any) => {
    if (completedModules.has(module.id)) return 'completed';

    const prereqsMet = module.prerequisites.every((prereq: string) =>
      completedModules.has(prereq)
    );
    if (!prereqsMet) return 'locked';

    return 'available';
  };

  const completionRate = Math.round((completedModules.size / modules.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-yellow-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center space-x-2 mb-4">
            <Link href="/learn" className="text-orange-100 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-orange-100">Back to Education Hub</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Sun className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Solar Basics</h1>
              <p className="text-xl text-orange-100">Master the fundamentals of solar energy</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full p-1 max-w-md">
            <div
              className="bg-white text-orange-500 text-sm font-medium text-center p-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate}% Complete
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Learning Path Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Path Overview</h2>
          <p className="text-gray-600 mb-6">
            This comprehensive introduction to solar energy covers everything you need to understand how solar works,
            different technologies available, costs and financing, and environmental benefits.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-orange-50 rounded-lg">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Total Duration</h3>
              <p className="text-gray-600">78 minutes</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Modules</h3>
              <p className="text-gray-600">{modules.length} interactive lessons</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Certificate</h3>
              <p className="text-gray-600">Upon completion</p>
            </div>
          </div>
        </div>

        {/* Module List */}
        <div className="space-y-6">
          {modules.map((module, index) => {
            const status = getModuleStatus(module);
            const isCompleted = status === 'completed';
            const isLocked = status === 'locked';
            const isAvailable = status === 'available';

            return (
              <div
                key={module.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                  isLocked ? 'opacity-60' : 'hover:shadow-xl'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-full ${
                        isCompleted ? 'bg-green-100 text-green-600' :
                        isLocked ? 'bg-gray-100 text-gray-400' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {module.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                          {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {isLocked && <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Locked</span>}
                        </div>

                        <p className="text-gray-600 mb-4">{module.description}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Topics Covered</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {module.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Learning Outcomes</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {module.learningOutcomes.map((outcome, outcomeIndex) => (
                                <li key={outcomeIndex} className="flex items-center space-x-2">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span>{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {module.prerequisites.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <strong>Prerequisites:</strong> Complete "{module.prerequisites.join('", "')}" first
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-4">{module.duration}</div>

                      <div className="space-y-2">
                        {!isLocked && (
                          <Link href={`/learn/basics/${module.id}`} className="block">
                            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                              isCompleted
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}>
                              <Play className="w-4 h-4" />
                              <span>{isCompleted ? 'Review' : 'Start'}</span>
                            </button>
                          </Link>
                        )}

                        <button
                          onClick={() => toggleModuleCompletion(module.id)}
                          disabled={isLocked}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            isCompleted
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{isCompleted ? 'Mark Incomplete' : 'Mark Complete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Actions */}
        {completionRate === 100 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h2>
            <p className="text-gray-600 mb-6">
              You've completed the Solar Basics learning path. You're now ready to advance to more specialized topics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/learn/advanced" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                <span>Advanced Topics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/learn/homeowner" className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                <span>Homeowner Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Take Action?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/calculator" className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200">
              <DollarSign className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-medium text-gray-900">Calculate Savings</h3>
              <p className="text-sm text-gray-600">See how much you could save with solar</p>
            </Link>
            <Link href="/installers" className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200">
              <Sun className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-medium text-gray-900">Find Installers</h3>
              <p className="text-sm text-gray-600">Connect with vetted solar professionals</p>
            </Link>
            <Link href="/join" className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200">
              <Zap className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-medium text-gray-900">Become a Solarpreneur</h3>
              <p className="text-sm text-gray-600">Earn Bitcoin while spreading solar</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}