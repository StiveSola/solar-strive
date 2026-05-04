// Location Intelligence Service for Solar Strive
// Identifies potential placement locations using business data and mapping APIs

export interface ProspectLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  businessType: BusinessType;
  category: string;
  subcategory?: string;

  // Prospecting intelligence
  placementPotential: PlacementPotential;
  targetAudience: TargetAudience;
  accessibilityScore: number; // 1-10
  visibilityScore: number; // 1-10
  competitorPresence: boolean;

  // Contact information
  phone?: string;
  website?: string;
  hours?: string;

  // Validation status
  isDocumented: boolean;
  lastVerified?: Date;
  documentedBy?: string;
}

export enum BusinessType {
  CAFE = 'cafe',
  GROCERY_STORE = 'grocery_store',
  HARDWARE_STORE = 'hardware_store',
  LIBRARY = 'library',
  COMMUNITY_CENTER = 'community_center',
  RESTAURANT = 'restaurant',
  FITNESS_CENTER = 'fitness_center',
  BANK = 'bank',
  MEDICAL_OFFICE = 'medical_office',
  RETAIL_STORE = 'retail_store',
  GAS_STATION = 'gas_station',
  PHARMACY = 'pharmacy'
}

export enum PlacementPotential {
  HIGH = 'high',       // Perfect target for solar materials
  MEDIUM = 'medium',   // Good potential with right approach
  LOW = 'low',         // Possible but challenging
  UNKNOWN = 'unknown'  // Needs assessment
}

export enum TargetAudience {
  HOMEOWNERS = 'homeowners',
  BUSINESS_OWNERS = 'business_owners',
  ENVIRONMENTALLY_CONSCIOUS = 'environmentally_conscious',
  HIGH_INCOME = 'high_income',
  TECH_SAVVY = 'tech_savvy',
  GENERAL_PUBLIC = 'general_public'
}

export interface ProspectFilter {
  businessTypes: BusinessType[];
  minPlacementPotential: PlacementPotential;
  maxDistance: number; // kilometers from user location
  targetAudiences: TargetAudience[];
  minVisibilityScore: number;
  onlyUndocumented: boolean;
}

export class LocationIntelligenceService {
  private businessTypeMapping = new Map<string, BusinessType>([
    // Mapbox/Google Places categories to our business types
    ['cafe', BusinessType.CAFE],
    ['coffee_shop', BusinessType.CAFE],
    ['bakery', BusinessType.CAFE],
    ['grocery_or_supermarket', BusinessType.GROCERY_STORE],
    ['supermarket', BusinessType.GROCERY_STORE],
    ['convenience_store', BusinessType.GROCERY_STORE],
    ['hardware_store', BusinessType.HARDWARE_STORE],
    ['home_goods_store', BusinessType.HARDWARE_STORE],
    ['library', BusinessType.LIBRARY],
    ['community_center', BusinessType.COMMUNITY_CENTER],
    ['restaurant', BusinessType.RESTAURANT],
    ['meal_takeaway', BusinessType.RESTAURANT],
    ['gym', BusinessType.FITNESS_CENTER],
    ['spa', BusinessType.FITNESS_CENTER],
    ['bank', BusinessType.BANK],
    ['atm', BusinessType.BANK],
    ['doctor', BusinessType.MEDICAL_OFFICE],
    ['dentist', BusinessType.MEDICAL_OFFICE],
    ['hospital', BusinessType.MEDICAL_OFFICE],
    ['clothing_store', BusinessType.RETAIL_STORE],
    ['electronics_store', BusinessType.RETAIL_STORE],
    ['gas_station', BusinessType.GAS_STATION],
    ['pharmacy', BusinessType.PHARMACY]
  ]);

  private placementPotentialRules = new Map<BusinessType, PlacementPotential>([
    [BusinessType.CAFE, PlacementPotential.HIGH],
    [BusinessType.GROCERY_STORE, PlacementPotential.HIGH],
    [BusinessType.HARDWARE_STORE, PlacementPotential.HIGH],
    [BusinessType.LIBRARY, PlacementPotential.MEDIUM],
    [BusinessType.COMMUNITY_CENTER, PlacementPotential.HIGH],
    [BusinessType.RESTAURANT, PlacementPotential.MEDIUM],
    [BusinessType.FITNESS_CENTER, PlacementPotential.MEDIUM],
    [BusinessType.BANK, PlacementPotential.LOW],
    [BusinessType.MEDICAL_OFFICE, PlacementPotential.MEDIUM],
    [BusinessType.RETAIL_STORE, PlacementPotential.MEDIUM],
    [BusinessType.GAS_STATION, PlacementPotential.LOW],
    [BusinessType.PHARMACY, PlacementPotential.MEDIUM]
  ]);

  private targetAudienceMapping = new Map<BusinessType, TargetAudience[]>([
    [BusinessType.CAFE, [TargetAudience.ENVIRONMENTALLY_CONSCIOUS, TargetAudience.TECH_SAVVY]],
    [BusinessType.GROCERY_STORE, [TargetAudience.HOMEOWNERS, TargetAudience.GENERAL_PUBLIC]],
    [BusinessType.HARDWARE_STORE, [TargetAudience.HOMEOWNERS, TargetAudience.BUSINESS_OWNERS]],
    [BusinessType.LIBRARY, [TargetAudience.ENVIRONMENTALLY_CONSCIOUS, TargetAudience.GENERAL_PUBLIC]],
    [BusinessType.COMMUNITY_CENTER, [TargetAudience.GENERAL_PUBLIC, TargetAudience.ENVIRONMENTALLY_CONSCIOUS]],
    [BusinessType.FITNESS_CENTER, [TargetAudience.HIGH_INCOME, TargetAudience.ENVIRONMENTALLY_CONSCIOUS]],
    [BusinessType.MEDICAL_OFFICE, [TargetAudience.HIGH_INCOME, TargetAudience.HOMEOWNERS]],
    [BusinessType.RETAIL_STORE, [TargetAudience.GENERAL_PUBLIC]]
  ]);

  /**
   * Find prospect locations using Mapbox Geocoding API or Google Places API
   */
  async findProspectLocations(
    centerCoordinates: [number, number],
    radiusKm: number = 10,
    filters?: ProspectFilter
  ): Promise<ProspectLocation[]> {
    try {
      console.log(`🔍 Searching for prospects within ${radiusKm}km of [${centerCoordinates.join(', ')}]`);

      // In production, this would call external APIs
      // For demo, we'll generate realistic prospect data
      const prospects = await this.generateProspectLocations(centerCoordinates, radiusKm);

      // Apply filters if provided
      let filteredProspects = prospects;
      if (filters) {
        filteredProspects = this.applyFilters(prospects, filters);
      }

      // Sort by placement potential and proximity
      filteredProspects.sort((a, b) => {
        const potentialOrder = [PlacementPotential.HIGH, PlacementPotential.MEDIUM, PlacementPotential.LOW];
        const aPotential = potentialOrder.indexOf(a.placementPotential);
        const bPotential = potentialOrder.indexOf(b.placementPotential);

        if (aPotential !== bPotential) {
          return aPotential - bPotential;
        }

        // Secondary sort by visibility score
        return b.visibilityScore - a.visibilityScore;
      });

      console.log(`✅ Found ${filteredProspects.length} prospect locations`);
      return filteredProspects;

    } catch (error) {
      console.error('❌ Failed to find prospect locations:', error);
      throw error;
    }
  }

  /**
   * Score a location's placement potential based on multiple factors
   */
  private calculatePlacementScores(
    businessType: BusinessType,
    coordinates: [number, number],
    isChain: boolean = false
  ): { accessibilityScore: number; visibilityScore: number } {

    // Base scores by business type
    const baseScores = {
      [BusinessType.CAFE]: { accessibility: 9, visibility: 8 },
      [BusinessType.GROCERY_STORE]: { accessibility: 8, visibility: 9 },
      [BusinessType.HARDWARE_STORE]: { accessibility: 7, visibility: 8 },
      [BusinessType.LIBRARY]: { accessibility: 9, visibility: 6 },
      [BusinessType.COMMUNITY_CENTER]: { accessibility: 8, visibility: 7 },
      [BusinessType.RESTAURANT]: { accessibility: 7, visibility: 6 },
      [BusinessType.FITNESS_CENTER]: { accessibility: 6, visibility: 5 },
      [BusinessType.BANK]: { accessibility: 5, visibility: 4 },
      [BusinessType.MEDICAL_OFFICE]: { accessibility: 6, visibility: 5 },
      [BusinessType.RETAIL_STORE]: { accessibility: 7, visibility: 7 },
      [BusinessType.GAS_STATION]: { accessibility: 5, visibility: 8 },
      [BusinessType.PHARMACY]: { accessibility: 7, visibility: 6 }
    };

    let scores = baseScores[businessType] || { accessibility: 5, visibility: 5 };

    // Adjust for chain vs independent (independent businesses often more willing)
    if (!isChain) {
      scores.accessibility += 1;
    }

    // Add some randomness to simulate real-world variation
    scores.accessibility = Math.min(10, Math.max(1, scores.accessibility + (Math.random() * 2 - 1)));
    scores.visibility = Math.min(10, Math.max(1, scores.visibility + (Math.random() * 2 - 1)));

    return {
      accessibilityScore: Math.round(scores.accessibility),
      visibilityScore: Math.round(scores.visibility)
    };
  }

  /**
   * Generate realistic prospect locations for demo purposes
   * In production, this would call Mapbox/Google Places APIs
   */
  private async generateProspectLocations(
    center: [number, number],
    radiusKm: number
  ): Promise<ProspectLocation[]> {
    const prospects: ProspectLocation[] = [];

    // Common business names by type
    const businessNames = {
      [BusinessType.CAFE]: [
        'Sunrise Coffee', 'The Daily Grind', 'Bean There', 'Roasted Awakening', 'Brew & View',
        'Corner Cafe', 'Steam Dreams', 'Perk Up Coffee', 'Morning Glory Cafe', 'Java Junction'
      ],
      [BusinessType.GROCERY_STORE]: [
        'Fresh Market', 'Green Grocer', 'Valley Foods', 'Corner Market', 'Sunshine Grocers',
        'Farm Fresh Foods', 'Local Harvest', 'Neighborhood Market', 'Family Foods', 'Green Valley Market'
      ],
      [BusinessType.HARDWARE_STORE]: [
        'Ace Hardware', 'Local Hardware', 'Fix-It Hardware', 'Builder\'s Supply', 'Tool Town',
        'Hardware Plus', 'Home & Garden Center', 'DIY Depot', 'Handyman\'s Helper', 'Build Right Hardware'
      ],
      [BusinessType.LIBRARY]: [
        'Central Library', 'Community Library', 'Public Library Branch', 'Neighborhood Library',
        'Memorial Library', 'City Library', 'Town Library', 'Carnegie Library'
      ],
      [BusinessType.COMMUNITY_CENTER]: [
        'Community Center', 'Civic Center', 'Recreation Center', 'Senior Center', 'Youth Center',
        'Cultural Center', 'Neighborhood Center', 'Activity Center', 'Social Services Center'
      ]
    };

    // Generate prospects for each business type
    for (const [businessType, names] of Object.entries(businessNames)) {
      const typeEnum = businessType as BusinessType;
      const numLocations = Math.floor(Math.random() * 5) + 2; // 2-6 locations per type

      for (let i = 0; i < numLocations; i++) {
        const name = names[Math.floor(Math.random() * names.length)];

        // Generate coordinates within radius
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radiusKm;
        const lat = center[1] + (distance / 111) * Math.cos(angle); // ~111km per degree
        const lng = center[0] + (distance / (111 * Math.cos(center[1] * Math.PI / 180))) * Math.sin(angle);

        const coordinates: [number, number] = [lng, lat];
        const scores = this.calculatePlacementScores(typeEnum, coordinates);

        const prospect: ProspectLocation = {
          id: `prospect_${typeEnum}_${i}_${Date.now()}`,
          name,
          coordinates,
          address: this.generateAddress(coordinates),
          businessType: typeEnum,
          category: typeEnum.replace('_', ' '),
          placementPotential: this.placementPotentialRules.get(typeEnum) || PlacementPotential.UNKNOWN,
          targetAudience: this.getTargetAudience(typeEnum),
          accessibilityScore: scores.accessibilityScore,
          visibilityScore: scores.visibilityScore,
          competitorPresence: Math.random() < 0.3, // 30% chance of competitor presence
          phone: this.generatePhoneNumber(),
          isDocumented: Math.random() < 0.1, // 10% already documented
          lastVerified: Math.random() < 0.1 ? new Date() : undefined
        };

        prospects.push(prospect);
      }
    }

    return prospects;
  }

  private getTargetAudience(businessType: BusinessType): TargetAudience {
    const audiences = this.targetAudienceMapping.get(businessType) || [TargetAudience.GENERAL_PUBLIC];
    return audiences[Math.floor(Math.random() * audiences.length)];
  }

  private generateAddress(coordinates: [number, number]): string {
    const streetNumbers = [123, 456, 789, 101, 234, 567, 890];
    const streetNames = [
      'Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 'Cedar Way',
      'First Ave', 'Second St', 'Park Blvd', 'Market St', 'Church St', 'School Rd'
    ];

    const number = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];

    return `${number} ${street}`;
  }

  private generatePhoneNumber(): string {
    const areaCode = ['555', '777', '888', '999'][Math.floor(Math.random() * 4)];
    const prefix = Math.floor(Math.random() * 900) + 100;
    const suffix = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${prefix}-${suffix}`;
  }

  /**
   * Apply filters to prospect list
   */
  private applyFilters(prospects: ProspectLocation[], filters: ProspectFilter): ProspectLocation[] {
    return prospects.filter(prospect => {
      // Business type filter
      if (filters.businessTypes.length > 0 && !filters.businessTypes.includes(prospect.businessType)) {
        return false;
      }

      // Placement potential filter
      const potentialOrder = [PlacementPotential.LOW, PlacementPotential.MEDIUM, PlacementPotential.HIGH];
      const prospectLevel = potentialOrder.indexOf(prospect.placementPotential);
      const minLevel = potentialOrder.indexOf(filters.minPlacementPotential);
      if (prospectLevel < minLevel) {
        return false;
      }

      // Target audience filter
      if (filters.targetAudiences.length > 0 && !filters.targetAudiences.includes(prospect.targetAudience)) {
        return false;
      }

      // Visibility score filter
      if (prospect.visibilityScore < filters.minVisibilityScore) {
        return false;
      }

      // Documentation status filter
      if (filters.onlyUndocumented && prospect.isDocumented) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get business intelligence for a specific location
   */
  async getLocationIntelligence(coordinates: [number, number]): Promise<{
    nearbyCompetitors: number;
    footTraffic: 'high' | 'medium' | 'low';
    demographics: string[];
    bestMaterials: string[];
  }> {
    // Simulate business intelligence gathering
    return {
      nearbyCompetitors: Math.floor(Math.random() * 5),
      footTraffic: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
      demographics: ['homeowners', 'young_professionals', 'families', 'seniors'].slice(0, Math.floor(Math.random() * 3) + 1),
      bestMaterials: ['business_cards', 'flyers', 'brochures'].slice(0, Math.floor(Math.random() * 2) + 1)
    };
  }

  /**
   * Document a prospect location (convert to actual location)
   */
  async documentProspectLocation(
    prospectId: string,
    userId: string,
    documentation: {
      contactPerson?: string;
      permissionGranted: boolean;
      surfaceType: string;
      capacity: number;
      notes: string;
      photos: string[];
    }
  ): Promise<{ success: boolean; locationId?: string; message: string }> {
    try {
      console.log(`📝 Documenting prospect ${prospectId} by user ${userId}`);

      // In production, this would:
      // 1. Update prospect status to documented
      // 2. Create new location record if permission granted
      // 3. Award discovery points/payment to user
      // 4. Update location intelligence data

      if (documentation.permissionGranted) {
        const locationId = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log(`✅ Prospect documented successfully, created location ${locationId}`);
        return {
          success: true,
          locationId,
          message: 'Location documented and added to placement network'
        };
      } else {
        console.log(`📋 Prospect documented but permission denied`);
        return {
          success: true,
          message: 'Prospect documented - permission not granted at this time'
        };
      }

    } catch (error) {
      console.error('❌ Failed to document prospect:', error);
      return {
        success: false,
        message: 'Failed to document location'
      };
    }
  }

  /**
   * Get prospecting statistics
   */
  async getProspectingStats(userId?: string): Promise<{
    totalProspects: number;
    documentedProspects: number;
    approvedLocations: number;
    discoveryEarnings: number;
    topBusinessTypes: { type: BusinessType; count: number }[];
  }> {
    // In production, query actual database
    return {
      totalProspects: 247,
      documentedProspects: 34,
      approvedLocations: 18,
      discoveryEarnings: 2500, // sats
      topBusinessTypes: [
        { type: BusinessType.CAFE, count: 12 },
        { type: BusinessType.GROCERY_STORE, count: 8 },
        { type: BusinessType.HARDWARE_STORE, count: 6 },
        { type: BusinessType.LIBRARY, count: 4 },
        { type: BusinessType.COMMUNITY_CENTER, count: 3 }
      ]
    };
  }
}

// Export singleton instance
export const locationIntelligenceService = new LocationIntelligenceService();

// Export types
export type { ProspectLocation, ProspectFilter };