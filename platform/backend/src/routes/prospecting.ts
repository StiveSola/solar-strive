// Prospecting API Routes for Solar Strive
// Handles location intelligence, prospect discovery, and documentation

import { Router, Request, Response } from 'express';
import { locationIntelligenceService } from '../services/LocationIntelligenceService';
import { arkadePaymentService } from '../services/ArkadePaymentService';

const router = Router();

/**
 * GET /api/prospecting/discover
 * Find potential placement locations near a given coordinate
 */
router.get('/discover', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 10, ...filters } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Latitude and longitude are required',
        message: 'Provide lat and lng query parameters'
      });
    }

    const coordinates: [number, number] = [parseFloat(lng as string), parseFloat(lat as string)];
    const radiusKm = parseInt(radius as string);

    console.log(`🔍 Discovering prospects near [${coordinates.join(', ')}] within ${radiusKm}km`);

    // Convert query filters to proper format
    const prospectFilters = {
      businessTypes: filters.businessTypes ? (filters.businessTypes as string).split(',') : [],
      minPlacementPotential: (filters.minPlacementPotential as any) || 'low',
      maxDistance: radiusKm,
      targetAudiences: filters.targetAudiences ? (filters.targetAudiences as string).split(',') : [],
      minVisibilityScore: parseInt(filters.minVisibilityScore as string) || 1,
      onlyUndocumented: filters.onlyUndocumented === 'true'
    };

    const prospects = await locationIntelligenceService.findProspectLocations(
      coordinates,
      radiusKm,
      prospectFilters
    );

    res.json({
      success: true,
      data: {
        prospects,
        searchCenter: coordinates,
        searchRadius: radiusKm,
        filters: prospectFilters,
        stats: {
          total: prospects.length,
          highPotential: prospects.filter(p => p.placementPotential === 'high').length,
          mediumPotential: prospects.filter(p => p.placementPotential === 'medium').length,
          lowPotential: prospects.filter(p => p.placementPotential === 'low').length,
          undocumented: prospects.filter(p => !p.isDocumented).length
        }
      }
    });

  } catch (error) {
    console.error('❌ Failed to discover prospects:', error);
    res.status(500).json({
      error: 'Failed to discover prospects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/prospecting/intelligence/:lat/:lng
 * Get business intelligence for a specific location
 */
router.get('/intelligence/:lat/:lng', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.params;
    const coordinates: [number, number] = [parseFloat(lng), parseFloat(lat)];

    console.log(`📊 Getting location intelligence for [${coordinates.join(', ')}]`);

    const intelligence = await locationIntelligenceService.getLocationIntelligence(coordinates);

    res.json({
      success: true,
      data: {
        coordinates,
        intelligence
      }
    });

  } catch (error) {
    console.error('❌ Failed to get location intelligence:', error);
    res.status(500).json({
      error: 'Failed to get location intelligence',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/prospecting/document
 * Document a prospect location
 */
router.post('/document', async (req: Request, res: Response) => {
  try {
    const {
      prospectId,
      userId,
      contactPerson,
      contactEmail,
      contactPhone,
      permissionGranted,
      permissionNotes,
      surfaceType,
      surfaceLocation,
      estimatedCapacity,
      accessibilityNotes,
      footTraffic,
      customerDemographics,
      competitorMaterials,
      competitorDetails,
      photos,
      notes,
      bestTimeToVisit,
      followUpNeeded,
      followUpDate
    } = req.body;

    if (!prospectId || !userId || !contactPerson || !surfaceType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'prospectId, userId, contactPerson, and surfaceType are required'
      });
    }

    console.log(`📝 Documenting prospect ${prospectId} by user ${userId}`);

    // Document the prospect
    const result = await locationIntelligenceService.documentProspectLocation(
      prospectId,
      userId,
      {
        contactPerson,
        permissionGranted,
        surfaceType,
        capacity: estimatedCapacity || 1,
        notes: notes || '',
        photos: photos || []
      }
    );

    if (!result.success) {
      return res.status(400).json({
        error: 'Failed to document prospect',
        message: result.message
      });
    }

    // Calculate discovery reward
    const baseReward = 25; // Base documentation reward
    const permissionBonus = permissionGranted ? 75 : 0; // Bonus for getting permission
    const totalReward = baseReward + permissionBonus;

    // Pay discovery reward (in production, this would be from a discovery fund)
    let paymentTxId = null;
    try {
      if (arkadePaymentService && arkadePaymentService.isReady && totalReward > 0) {
        // In production, would need user's payment address
        const userPaymentAddress = req.body.userPaymentAddress || 'placeholder_address';

        // For now, we'll simulate the payment
        // paymentTxId = await arkadePaymentService.payAttributionReward(
        //   `prospect_${prospectId}`,
        //   userPaymentAddress,
        //   totalReward
        // );

        console.log(`💰 Discovery reward: ${totalReward} sats (simulated payment)`);
      }
    } catch (paymentError) {
      console.error('❌ Failed to pay discovery reward:', paymentError);
      // Continue with success response even if payment fails
    }

    res.json({
      success: true,
      data: {
        prospectId,
        documentationResult: result,
        reward: {
          baseReward,
          permissionBonus,
          totalReward,
          paymentTxId
        },
        newLocationId: result.locationId || null
      },
      message: permissionGranted
        ? `Prospect documented and location created! Earned ${totalReward} sats.`
        : `Prospect documented. Earned ${totalReward} sats.`
    });

  } catch (error) {
    console.error('❌ Failed to document prospect:', error);
    res.status(500).json({
      error: 'Failed to document prospect',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/prospecting/stats
 * Get prospecting statistics for a user
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    console.log(`📊 Getting prospecting stats for user ${userId || 'all'}`);

    const stats = await locationIntelligenceService.getProspectingStats(userId as string);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Failed to get prospecting stats:', error);
    res.status(500).json({
      error: 'Failed to get prospecting stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/prospecting/business-types
 * Get available business types for filtering
 */
router.get('/business-types', async (req: Request, res: Response) => {
  try {
    const businessTypes = [
      { id: 'cafe', name: 'Coffee Shops & Cafes', potential: 'high', description: 'Environmentally conscious customers' },
      { id: 'grocery_store', name: 'Grocery Stores', potential: 'high', description: 'Homeowners and families' },
      { id: 'hardware_store', name: 'Hardware Stores', potential: 'high', description: 'DIY homeowners and contractors' },
      { id: 'library', name: 'Libraries', potential: 'medium', description: 'General public, educational focus' },
      { id: 'community_center', name: 'Community Centers', potential: 'high', description: 'Local community engagement' },
      { id: 'restaurant', name: 'Restaurants', potential: 'medium', description: 'Diverse customer base' },
      { id: 'fitness_center', name: 'Fitness Centers', potential: 'medium', description: 'Health-conscious customers' },
      { id: 'medical_office', name: 'Medical Offices', potential: 'medium', description: 'Professional, high-income clientele' },
      { id: 'retail_store', name: 'Retail Stores', potential: 'medium', description: 'General shopping audience' },
      { id: 'bank', name: 'Banks', potential: 'low', description: 'Professional environment, restrictions' },
      { id: 'gas_station', name: 'Gas Stations', potential: 'low', description: 'Quick transactions, less engagement' },
      { id: 'pharmacy', name: 'Pharmacies', potential: 'medium', description: 'Regular customer visits' }
    ];

    res.json({
      success: true,
      data: {
        businessTypes,
        stats: {
          totalTypes: businessTypes.length,
          highPotential: businessTypes.filter(bt => bt.potential === 'high').length,
          mediumPotential: businessTypes.filter(bt => bt.potential === 'medium').length,
          lowPotential: businessTypes.filter(bt => bt.potential === 'low').length
        }
      }
    });

  } catch (error) {
    console.error('❌ Failed to get business types:', error);
    res.status(500).json({
      error: 'Failed to get business types',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/prospecting/leaderboard
 * Get top prospect documenters leaderboard
 */
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    // Mock leaderboard data - in production, query database
    const leaderboard = [
      {
        userId: 'user1',
        username: 'SolarScout',
        prospectsDocumented: 47,
        locationsCreated: 23,
        totalEarnings: 3250,
        averageScore: 8.7,
        rank: 1
      },
      {
        userId: 'user2',
        username: 'LocationHunter',
        prospectsDocumented: 39,
        locationsCreated: 18,
        totalEarnings: 2890,
        averageScore: 8.4,
        rank: 2
      },
      {
        userId: 'user3',
        username: 'ProspectPro',
        prospectsDocumented: 34,
        locationsCreated: 15,
        totalEarnings: 2340,
        averageScore: 7.9,
        rank: 3
      },
      {
        userId: 'user4',
        username: 'SolarSeeker',
        prospectsDocumented: 28,
        locationsCreated: 12,
        totalEarnings: 1950,
        averageScore: 8.1,
        rank: 4
      },
      {
        userId: 'user5',
        username: 'LocationLead',
        prospectsDocumented: 22,
        locationsCreated: 9,
        totalEarnings: 1540,
        averageScore: 7.6,
        rank: 5
      }
    ];

    res.json({
      success: true,
      data: {
        leaderboard,
        period: 'all_time',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Failed to get leaderboard:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as prospectingRoutes };