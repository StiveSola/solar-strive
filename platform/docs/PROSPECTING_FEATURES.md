# Solar Strive Prospecting Features
**Advanced Location Intelligence & Discovery System**

---

## 🔍 Overview

The prospecting system transforms Solar Strive from a simple job platform into an intelligent location discovery network. Users can now identify potential placement locations using business intelligence, document prospects through structured workflows, and earn Bitcoin rewards for successful discoveries.

---

## ✨ Key Features

### 1. **Intelligent Location Discovery**
- **Business Type Classification**: Automatic identification of cafes, grocery stores, hardware stores, libraries, and community centers
- **Placement Potential Scoring**: AI-powered assessment of location suitability (High/Medium/Low)
- **Accessibility & Visibility Metrics**: 1-10 scoring for approach difficulty and customer visibility
- **Competitive Analysis**: Detection of existing solar marketing materials

### 2. **Prospecting Mode Interface**
- **Map Style Toggle**: Switches to satellite view for better location identification
- **Smart Filtering**: Filter by business type, potential score, documentation status
- **Real-time Discovery**: Dynamic prospect generation based on current map area
- **Visual Intelligence**: Color-coded markers showing potential and documentation status

### 3. **Structured Documentation Workflow**
- **4-Step Process**: Contact → Location → Intelligence → Documentation
- **Permission Tracking**: Formal approval process with contact information
- **Surface Assessment**: Detailed evaluation of placement surfaces and capacity
- **Business Intelligence**: Customer demographics, foot traffic, competitor presence
- **Photo Documentation**: Visual evidence and location verification

### 4. **Discovery Rewards System**
- **Base Documentation**: 25 sats per prospect documented
- **Permission Bonus**: +75 sats when placement permission is granted
- **Location Creation**: Automatic conversion of approved prospects to active locations
- **Attribution Tracking**: Full credit chain from discovery to conversion

---

## 🎯 Target Business Types

### High-Potential Locations
```
☕ Cafes & Coffee Shops
├── Target Audience: Environmentally conscious, tech-savvy
├── Accessibility Score: 9/10 (easy approach)
├── Visibility Score: 8/10 (high customer engagement)
└── Best Materials: Flyers, business cards

🏪 Grocery Stores
├── Target Audience: Homeowners, families
├── Accessibility Score: 8/10 (multiple entry points)
├── Visibility Score: 9/10 (high foot traffic)
└── Best Materials: All formats accepted

🔧 Hardware Stores
├── Target Audience: Homeowners, contractors, DIY enthusiasts
├── Accessibility Score: 7/10 (business-focused environment)
├── Visibility Score: 8/10 (engaged, project-focused customers)
└── Best Materials: Business cards, brochures

🏛️ Community Centers
├── Target Audience: Local community, families
├── Accessibility Score: 8/10 (public access)
├── Visibility Score: 7/10 (community bulletin boards)
└── Best Materials: Event flyers, information sheets
```

### Medium-Potential Locations
```
📚 Libraries
├── Target Audience: General public, students
├── Accessibility Score: 9/10 (public institution)
├── Visibility Score: 6/10 (quiet environment)
└── Best Materials: Educational content

🍽️ Restaurants
├── Target Audience: General dining public
├── Accessibility Score: 7/10 (depends on establishment)
├── Visibility Score: 6/10 (dining-focused attention)
└── Best Materials: Table tents, window displays

🏋️ Fitness Centers
├── Target Audience: Health-conscious, higher income
├── Accessibility Score: 6/10 (membership required)
├── Visibility Score: 5/10 (workout-focused attention)
└── Best Materials: Health & wellness angle materials
```

---

## 🛠️ Technical Implementation

### Location Intelligence Service
```typescript
// Core service for prospect discovery
class LocationIntelligenceService {
  async findProspectLocations(
    centerCoordinates: [number, number],
    radiusKm: number = 10,
    filters?: ProspectFilter
  ): Promise<ProspectLocation[]>

  async documentProspectLocation(
    prospectId: string,
    userId: string,
    documentation: DocumentationData
  ): Promise<DocumentationResult>

  async getLocationIntelligence(
    coordinates: [number, number]
  ): Promise<BusinessIntelligence>
}
```

### Prospect Data Structure
```typescript
interface ProspectLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  address: string;
  businessType: BusinessType;
  placementPotential: 'high' | 'medium' | 'low';
  accessibilityScore: number; // 1-10
  visibilityScore: number;    // 1-10
  competitorPresence: boolean;
  isDocumented: boolean;
  phone?: string;
}
```

### Documentation Workflow
```typescript
interface DocumentationData {
  // Contact Information
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  permissionGranted: boolean;

  // Location Assessment
  surfaceType: string;
  estimatedCapacity: number;
  accessibilityNotes: string;

  // Business Intelligence
  footTraffic: 'high' | 'medium' | 'low';
  customerDemographics: string[];
  competitorMaterials: boolean;

  // Documentation
  photos: File[];
  notes: string;
  followUpNeeded: boolean;
}
```

---

## 🗺️ User Interface Components

### Enhanced Interactive Map
- **Mode Toggle**: Switch between placement and prospecting modes
- **Dynamic Markers**: Color-coded by potential and documentation status
- **Filtering Controls**: Business type, potential level, documentation status
- **Satellite Overlay**: Better visualization for location identification
- **Real-time Stats**: Prospect count, documentation progress

### Prospect Documentation Modal
- **Multi-step Form**: Guided workflow for thorough documentation
- **Contact Management**: Business owner information and permissions
- **Surface Assessment**: Technical evaluation of placement surfaces
- **Intelligence Gathering**: Customer demographics and competitor analysis
- **Photo Upload**: Visual documentation and verification

### Dashboard Integration
- **Prospecting Stats**: Discovery earnings, locations documented, conversion rates
- **Mode-specific Controls**: Different filters and actions based on current mode
- **Quick Actions**: Fast access to documentation and prospecting tools
- **Performance Metrics**: Track discovery success and earnings

---

## 💰 Economic Model

### Discovery Rewards Structure
```
Base Documentation Reward: 25 sats
├── Contact Information Collected: ✅
├── Surface Assessment Completed: ✅
├── Photos Submitted: ✅
└── Business Intelligence Gathered: ✅

Permission Bonus: +75 sats
├── Permission Granted: ✅
├── Contact Details Verified: ✅
├── Surface Capacity Confirmed: ✅
└── Location Added to Network: ✅

Total Potential: 100 sats per prospect
Monthly Goal: 50 prospects = 5,000 sats
Annual Potential: 60,000 sats (~$25 at current rates)
```

### Quality Incentives
- **High-Quality Documentation**: Bonus for complete, accurate submissions
- **Permission Success Rate**: Higher rewards for users with better approval rates
- **Location Performance**: Ongoing royalties from successful placements
- **Verification Accuracy**: Rewards for accurate business intelligence

---

## 📊 Analytics & Tracking

### Discovery Metrics
- **Prospects Identified**: Total discovered by user/region/time
- **Documentation Rate**: Percentage of prospects successfully documented
- **Permission Success**: Approval rate for placement requests
- **Location Activation**: Conversion from prospect to active location
- **Geographic Coverage**: Heat maps of discovery activity

### Business Intelligence Metrics
- **Business Type Distribution**: Most common/successful prospect types
- **Foot Traffic Correlation**: Traffic level vs. conversion success
- **Competitor Analysis**: Market saturation by region
- **Demographics Mapping**: Customer profile effectiveness

### User Performance Metrics
- **Discovery Leaderboard**: Top prospect documenters
- **Quality Scores**: Documentation completeness and accuracy
- **Earnings Tracking**: Discovery rewards and ongoing royalties
- **Geographic Efficiency**: Prospects per mile/region coverage

---

## 🚀 API Endpoints

### Core Prospecting Endpoints
```bash
# Discover prospects in area
GET /api/prospecting/discover?lat={lat}&lng={lng}&radius={km}

# Get business intelligence for location
GET /api/prospecting/intelligence/{lat}/{lng}

# Document a prospect
POST /api/prospecting/document

# Get user prospecting statistics
GET /api/prospecting/stats?userId={id}

# Get business type reference data
GET /api/prospecting/business-types

# View prospecting leaderboard
GET /api/prospecting/leaderboard
```

### Request/Response Examples
```json
// Prospect Discovery Response
{
  "success": true,
  "data": {
    "prospects": [
      {
        "id": "prospect_cafe_123",
        "name": "Sunrise Coffee",
        "coordinates": [-74.006, 40.713],
        "businessType": "cafe",
        "placementPotential": "high",
        "accessibilityScore": 9,
        "visibilityScore": 8,
        "isDocumented": false
      }
    ],
    "stats": {
      "total": 23,
      "highPotential": 8,
      "undocumented": 19
    }
  }
}

// Documentation Submission
{
  "prospectId": "prospect_cafe_123",
  "userId": "user_456",
  "contactPerson": "Sarah Johnson",
  "permissionGranted": true,
  "surfaceType": "cork_board",
  "estimatedCapacity": 10,
  "footTraffic": "high",
  "photos": ["photo1.jpg", "photo2.jpg"],
  "notes": "Very enthusiastic about solar energy"
}
```

---

## 🎯 Success Workflows

### Typical User Journey
1. **Discovery Phase**
   - User enables prospecting mode
   - Map shows potential locations with intelligence scoring
   - User identifies promising prospects (red markers = high potential)

2. **Assessment Phase**
   - User visits location in person
   - Evaluates surface availability and quality
   - Assesses foot traffic and customer demographics

3. **Contact Phase**
   - User approaches business owner/manager
   - Explains Solar Strive placement program
   - Requests permission for material placement

4. **Documentation Phase**
   - User submits complete documentation through app
   - Photos, contact info, surface details, intelligence
   - System processes and validates submission

5. **Reward Phase**
   - Base documentation reward: 25 sats
   - Permission bonus (if approved): +75 sats
   - Location activation (if approved): ongoing royalties

### Quality Best Practices
- **Professional Approach**: Business attire, polite communication
- **Value Proposition**: Emphasize solar education and community benefit
- **Complete Documentation**: Fill all required fields thoroughly
- **Accurate Photography**: Clear images of surfaces and business
- **Follow-up Planning**: Note best contact times and preferences

---

## 🔮 Future Enhancements

### Advanced Intelligence (Phase 2)
- **AI Photo Analysis**: Automatic surface type and capacity detection
- **Sentiment Analysis**: Social media monitoring for solar interest
- **Foot Traffic API**: Real-time visitor count integration
- **Demographic API**: Census data integration for targeting

### Gamification (Phase 3)
- **Discovery Challenges**: Monthly goals and achievements
- **Territory System**: Geographic responsibility areas
- **Skill Trees**: Progression paths for different prospect types
- **Social Features**: Team discovery and collaboration

### Integration Expansion (Phase 4)
- **CRM Integration**: Business relationship management
- **Calendar Sync**: Follow-up scheduling and reminders
- **Route Optimization**: Efficient multi-location visits
- **Performance Prediction**: ML-based success probability

---

## 📋 Getting Started

### For New Prospectors
1. **Enable Prospecting Mode**: Toggle the 🔍 button on the map
2. **Explore Your Area**: Look for red (high potential) markers
3. **Visit Promising Locations**: Start with cafes and grocery stores
4. **Document Thoroughly**: Complete all sections for maximum rewards
5. **Build Relationships**: Focus on permission success for ongoing benefits

### For Experienced Users
1. **Optimize Routes**: Plan efficient multi-location visits
2. **Track Performance**: Monitor permission success rates
3. **Share Intelligence**: Report competitor activity and market changes
4. **Expand Territory**: Systematically cover new geographic areas
5. **Mentor Others**: Help new prospectors improve their success rates

---

*The prospecting system transforms location discovery from guesswork into intelligent, data-driven business development. Every documented prospect builds the Solar Strive network while rewarding contributors with Bitcoin payments.*

**Discover locations. Document prospects. Earn Bitcoin. Build the future of solar marketing.**