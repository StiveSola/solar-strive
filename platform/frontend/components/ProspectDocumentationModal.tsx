'use client';

// Prospect Documentation Modal
// Allows users to document potential placement locations they've discovered

import React, { useState } from 'react';

export interface ProspectLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  address: string;
  businessType: string;
  placementPotential: 'high' | 'medium' | 'low' | 'unknown';
  accessibilityScore: number;
  visibilityScore: number;
  phone?: string;
}

interface ProspectDocumentationModalProps {
  prospect: ProspectLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documentation: DocumentationData) => void;
}

export interface DocumentationData {
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  permissionGranted: boolean;
  permissionNotes: string;

  // Location details
  surfaceType: string;
  surfaceLocation: string;
  estimatedCapacity: number;
  accessibilityNotes: string;

  // Business intelligence
  footTraffic: 'high' | 'medium' | 'low';
  customerDemographics: string[];
  competitorMaterials: boolean;
  competitorDetails: string;

  // Documentation
  photos: File[];
  notes: string;
  bestTimeToVisit: string;
  followUpNeeded: boolean;
  followUpDate?: string;
}

export default function ProspectDocumentationModal({
  prospect,
  isOpen,
  onClose,
  onSubmit
}: ProspectDocumentationModalProps) {
  const [formData, setFormData] = useState<DocumentationData>({
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    permissionGranted: false,
    permissionNotes: '',

    surfaceType: '',
    surfaceLocation: '',
    estimatedCapacity: 1,
    accessibilityNotes: '',

    footTraffic: 'medium',
    customerDemographics: [],
    competitorMaterials: false,
    competitorDetails: '',

    photos: [],
    notes: '',
    bestTimeToVisit: '',
    followUpNeeded: false,
    followUpDate: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const surfaceTypes = [
    { value: 'cork_board', label: 'Cork Board' },
    { value: 'glass_window', label: 'Window Display' },
    { value: 'magnetic_surface', label: 'Magnetic Surface' },
    { value: 'wall_mount', label: 'Wall Mount' },
    { value: 'counter_display', label: 'Counter Display' },
    { value: 'bulletin_board', label: 'Bulletin Board' },
    { value: 'rack_display', label: 'Brochure Rack' }
  ];

  const demographics = [
    'Homeowners', 'Young Professionals', 'Families', 'Seniors',
    'Students', 'Environmentally Conscious', 'High Income', 'Tech Savvy'
  ];

  const handleInputChange = (field: keyof DocumentationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDemographicsChange = (demographic: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      customerDemographics: checked
        ? [...prev.customerDemographics, demographic]
        : prev.customerDemographics.filter(d => d !== demographic)
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        permissionGranted: false,
        permissionNotes: '',
        surfaceType: '',
        surfaceLocation: '',
        estimatedCapacity: 1,
        accessibilityNotes: '',
        footTraffic: 'medium',
        customerDemographics: [],
        competitorMaterials: false,
        competitorDetails: '',
        photos: [],
        notes: '',
        bestTimeToVisit: '',
        followUpNeeded: false,
        followUpDate: ''
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to submit documentation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isOpen || !prospect) return null;

  const stepTitles = [
    'Contact Information',
    'Location Details',
    'Business Intelligence',
    'Documentation & Photos'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                📝 Document Location
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {prospect.name} • {prospect.businessType.replace('_', ' ')}
              </p>
              <p className="text-xs text-gray-500">{prospect.address}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-4 space-x-2">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`flex-1 text-center py-2 px-1 rounded text-xs font-medium ${
                  index + 1 === currentStep
                    ? 'bg-blue-100 text-blue-800'
                    : index + 1 < currentStep
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}. {title}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name of person you spoke with"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@business.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissionGranted}
                    onChange={(e) => handleInputChange('permissionGranted', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Permission granted to place marketing materials
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Notes
                </label>
                <textarea
                  value={formData.permissionNotes}
                  onChange={(e) => handleInputChange('permissionNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Details about permission, restrictions, or follow-up needed..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface Type *
                </label>
                <select
                  value={formData.surfaceType}
                  onChange={(e) => handleInputChange('surfaceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select surface type...</option>
                  {surfaceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface Location
                </label>
                <input
                  type="text"
                  value={formData.surfaceLocation}
                  onChange={(e) => handleInputChange('surfaceLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Front window, bulletin board near entrance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Capacity (number of materials)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.estimatedCapacity}
                  onChange={(e) => handleInputChange('estimatedCapacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accessibility Notes
                </label>
                <textarea
                  value={formData.accessibilityNotes}
                  onChange={(e) => handleInputChange('accessibilityNotes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How easy is it to access? Any special requirements or restrictions?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Time to Visit
                </label>
                <input
                  type="text"
                  value={formData.bestTimeToVisit}
                  onChange={(e) => handleInputChange('bestTimeToVisit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Weekday mornings, avoid lunch rush"
                />
              </div>
            </div>
          )}

          {/* Step 3: Business Intelligence */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foot Traffic
                </label>
                <div className="flex space-x-4">
                  {['low', 'medium', 'high'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="footTraffic"
                        value={level}
                        checked={formData.footTraffic === level}
                        onChange={(e) => handleInputChange('footTraffic', e.target.value)}
                        className="mr-2"
                      />
                      <span className="capitalize text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Demographics (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {demographics.map(demo => (
                    <label key={demo} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.customerDemographics.includes(demo)}
                        onChange={(e) => handleDemographicsChange(demo, e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{demo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.competitorMaterials}
                    onChange={(e) => handleInputChange('competitorMaterials', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Competitor materials present
                  </span>
                </label>
              </div>

              {formData.competitorMaterials && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Competitor Details
                  </label>
                  <textarea
                    value={formData.competitorDetails}
                    onChange={(e) => handleInputChange('competitorDetails', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Which competitors? What type of materials?"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Documentation & Photos */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.photos.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                          📷 {photo.name.substring(0, 10)}...
                        </div>
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional observations, concerns, or recommendations..."
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.followUpNeeded}
                    onChange={(e) => handleInputChange('followUpNeeded', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Follow-up needed
                  </span>
                </label>
              </div>

              {formData.followUpNeeded && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ← Previous
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !formData.contactPerson}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.contactPerson || !formData.surfaceType}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : '📝 Submit Documentation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}