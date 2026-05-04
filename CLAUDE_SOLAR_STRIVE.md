# Solar Strive - Unified Solar Sales & Installation Platform

## Project Overview

**Solar Strive** is part of the broader PlebMoe ecosystem - a comprehensive Bitcoin-first solar energy platform that handles the entire customer journey from prospecting through installation. The platform integrates physical marketing material placement, lead evaluation, site surveys, permit processing, and installation services under a single unified system.

**Core Vision:** Create a vertically-integrated solar platform that owns the entire customer lifecycle - from initial awareness through completed installation - while leveraging crowdsourced marketing and Bitcoin payment infrastructure.

---

## 🏗️ Technical Architecture

### Microservices Infrastructure
```
┌─────────────────────────────────────────────────────────────┐
│                    Solar Strive Platform                     │
├─────────────────────────────────────────────────────────────┤
│ Frontend Web App (Next.js/React)                            │
│ ├── Interactive Map Interface                               │
│ ├── User Dashboard                                          │
│ ├── Job Management Portal                                   │
│ └── Attribution Tracking UI                                 │
├─────────────────────────────────────────────────────────────┤
│ API Gateway (Express.js/FastAPI)                            │
│ ├── Authentication Service                                  │
│ ├── Authorization & Role Management                         │
│ ├── Rate Limiting & Request Routing                         │
│ └── API Versioning                                          │
├─────────────────────────────────────────────────────────────┤
│ Core Microservices                                          │
│ ├── User Management Service                                 │
│ ├── Location Management Service                             │
│ ├── Job Orchestration Service                               │
│ ├── Attribution Tracking Service                            │
│ ├── Payment Processing Service (ArkadeOS)                   │
│ ├── Verification Service (Image AI)                         │
│ └── Notification Service                                     │
├─────────────────────────────────────────────────────────────┤
│ Internal Solar Services                                      │
│ ├── Solar Evaluation & Site Survey Service                  │
│ ├── Permit Processing Service                               │
│ ├── Installation Management Service                         │
│ ├── Equipment Procurement Service                           │
│ └── Customer Support & Monitoring Service                   │
├─────────────────────────────────────────────────────────────┤
│ External Integrations                                        │
│ ├── ArkadeOS Payment & Escrow System                        │
│ ├── Geolocation Services (Google Maps/OpenStreetMap)        │
│ ├── Image Recognition/ML Services                           │
│ └── Equipment Supplier APIs                                 │
├─────────────────────────────────────────────────────────────┤
│ Data Layer                                                   │
│ ├── PostgreSQL (Primary Database)                           │
│ ├── Redis (Caching & Session Management)                    │
│ ├── S3/IPFS (Image Storage)                                 │
│ └── Analytics Database (TimescaleDB)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Ecosystem

### Primary User Types

#### 1. **Sales Representatives** (Internal Solar Sales Team)
- Manage lead pipeline from initial contact to close
- Conduct virtual and in-person consultations
- Create customized proposals using internal tools
- Track commissions through attribution system
- Coordinate with evaluation and installation teams

#### 2. **Field Marketers** (Material Placement & Lead Generation)
- Place marketing materials at strategic locations
- Earn Bitcoin payments for successful placements
- Generate initial leads through QR code campaigns
- Build reputation through successful conversions
- Transition high-quality leads to sales team

#### 3. **Solar Evaluators** (Site Survey & Technical Assessment)
- Conduct on-site evaluations and measurements
- Create detailed permit-ready plans
- Assess electrical systems and roof conditions
- Generate technical proposals and system designs
- Earn per-evaluation fees plus conversion bonuses

#### 4. **Installation Teams** (In-House Solar Installers)
- Complete solar panel installations
- Handle electrical connections and system commissioning
- Manage permit inspections and utility interconnections
- Provide post-installation support and monitoring
- Earn project-based installation fees

#### 5. **Customers** (Solar System Buyers)
- Request evaluations through QR codes or website
- Receive comprehensive proposals and financing options
- Track installation progress through customer portal
- Access system monitoring and production data
- Participate in referral programs for additional savings

---

## ⚡ ArkadeOS Payment & Escrow Integration

### Core Payment Architecture

**ArkadeOS/Arkade Overview:**
- Programmable execution layer for Bitcoin with instant settlement
- Virtual Transaction Outputs (VTXOs) for offchain Bitcoin operations
- Lightning Network integration via Boltz submarine swaps
- Self-custody guarantees with unilateral exit mechanisms

### Payment Workflows for Solar Strive

#### 1. **Customer Payment Flow**
```
Customer Deposit → ArkadeOS Escrow VTXO →
Site Evaluation Complete → Partial Release →
Permits Approved → Equipment Order Release →
Installation Complete → Final Payment Release →
System Commissioned → Customer Satisfaction Verified
```

#### 2. **Lightning Network Integration**
```
Worker Payment Request → Submarine Swap (Arkade→Lightning) →
Instant Payment to Popular Wallets (Phoenix, Wallet of Satoshi) →
No Channel Management Required
```

#### 3. **Internal Team Commission Distribution**
```
Customer Payment (Full Installation) → ArkadeOS Escrow → Distribution:
├── 35% → Equipment & Materials Cost
├── 20% → Installation Team
├── 15% → Sales Representative
├── 10% → Solar Evaluator
├── 5% → Field Marketer (Attribution)
├── 10% → Platform Operations
└── 5% → Customer Support Fund
```

### Technical Implementation Stack

**ArkadeOS SDKs Available:**
- **TypeScript SDK**: Web frontend integration
- **Go SDK**: High-performance backend services
- **Rust SDK**: Energy monitoring system integration

**Key Features for Solar Strive:**
- Programmable smart contracts for milestone-based payments
- Instant settlement without Bitcoin block confirmations
- Custom assets for energy credits and project tokens
- Batch settlement for cost efficiency

---

## 🗺️ Location & Job Management

### Interactive Map System

#### Technology Stack
```
Frontend: Mapbox GL JS / Leaflet + OpenStreetMap
├── Real-time Location Markers
│   ├── Available Locations (Green)
│   ├── Occupied Locations (Blue)
│   ├── Job Opportunities (Orange)
│   └── Verification Needed (Red)
├── Clustering for Dense Areas
├── Filter Layers by Payment Range/Distance
└── Mobile-First Responsive Design
```

#### Database Schema (Key Tables)
```sql
-- Location management
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    business_name VARCHAR(255),
    surface_type ENUM('cork_board', 'glass', 'magnetic', 'wall'),
    holder_type ENUM('business_card', 'flyer', 'both'),
    capacity INTEGER,
    current_count INTEGER DEFAULT 0,
    availability_status ENUM('available', 'occupied', 'pending'),
    hourly_rate_sats INTEGER,
    arkade_contract_id VARCHAR(255), -- ArkadeOS VTXO reference
    reputation_score DECIMAL(3,2)
);

-- Customer project management
CREATE TABLE solar_projects (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    project_stage ENUM('lead', 'consultation', 'evaluation', 'proposal', 'contract', 'permit', 'installation', 'complete'),
    system_size_kw DECIMAL(5,2),
    total_price INTEGER,
    arkade_escrow_vtxo VARCHAR(255), -- ArkadeOS escrow VTXO
    arkade_release_conditions TEXT, -- JSON milestone-based conditions
    sales_rep_id INTEGER REFERENCES employees(id),
    evaluator_id INTEGER REFERENCES employees(id),
    installation_team_id INTEGER REFERENCES installation_teams(id),
    attribution_source VARCHAR(255), -- QR code or referral source
    created_at TIMESTAMP DEFAULT NOW()
);

-- Internal team management
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_type ENUM('sales_rep', 'evaluator', 'installer', 'field_marketer', 'support'),
    name VARCHAR(255),
    commission_rate DECIMAL(4,2),
    performance_score DECIMAL(3,2),
    bitcoin_wallet_address VARCHAR(255),
    total_projects_completed INTEGER DEFAULT 0
);
```

---

## 🎯 Attribution & Tracking Framework

### QR Code Attribution System

#### QR Structure with ArkadeOS Integration
```
https://solarstrive.com/l/{attribution_id}
├── Attribution Components:
│   ├── Material Owner ID (6 chars)
│   ├── Placer ID (6 chars)
│   ├── Location ID (6 chars)
│   ├── Campaign ID (4 chars)
│   └── Timestamp (8 chars)
└── ArkadeOS Payment Triggers:
    ├── Scan Event → Micro-payment to Stakeholders
    ├── Lead Conversion → Revenue Distribution
    └── Attribution Royalties → Ongoing Payments
```

### Integrated Sales Pipeline

#### End-to-End Customer Journey
```
QR Scan/Web Lead → Initial Consultation (Sales Rep) →
Site Evaluation (Evaluator Team) → Technical Proposal →
Contract Signing → Permit Processing (Internal Team) →
Equipment Procurement → Installation (In-House Crews) →
System Commissioning → Monitoring & Support
```

**Key Process Points:**
- **Lead Qualification**: Internal sales team handles all initial contacts
- **Technical Assessment**: In-house evaluators create permit-ready plans
- **Installation Control**: Company-employed crews ensure quality standards
- **Customer Relationship**: Single point of contact throughout entire process

---

## 🏗️ White-Label Architecture

### Modular Platform Design

#### Industry Configuration Framework
```json
{
  "industry_config": {
    "name": "solar_strive",
    "partner_integrations": [
      {
        "name": "powur",
        "api_endpoint": "https://api.powur.com/v1/",
        "conversion_tracking": true,
        "commission_model": "upfront_site_survey"
      }
    ],
    "payment_flows": {
      "upfront_model": true,
      "arkade_escrow": true,
      "revenue_splits": {
        "material_owner": 0.40,
        "placer": 0.15,
        "location_owner": 0.10,
        "partner": 0.15,
        "platform": 0.10,
        "verification_fund": 0.10
      }
    }
  }
}
```

#### Future Industry Applications
- **Festival Promotion**: Event ticket sales integration
- **Restaurant Marketing**: POS system integration
- **Real Estate**: MLS/property database integration
- **Political Campaigns**: Compliance tracking integration

---

## 🚀 Implementation Roadmap

### Phase 1: Unified Platform MVP (Months 1-3)
**Core Solar Sales & Installation System**
- [ ] Employee management and role-based access
- [ ] ArkadeOS integration for customer payments
- [ ] Customer portal with project tracking
- [ ] Sales CRM with lead management
- [ ] Evaluation scheduling and reporting tools
- [ ] Installation project management system

### Phase 2: Advanced Operations (Months 4-6)
**Process Optimization & Automation**
- [ ] Automated permit processing system
- [ ] Equipment procurement automation
- [ ] Dynamic pricing and proposal generation
- [ ] Installation crew scheduling optimization
- [ ] Customer financing integration
- [ ] Real-time project status tracking

### Phase 3: Scale & Efficiency (Months 7-9)
**Growth Infrastructure**
- [ ] Multi-region expansion support
- [ ] Bulk equipment purchasing contracts
- [ ] Training and certification platform
- [ ] Quality assurance automation
- [ ] Customer referral program
- [ ] Post-installation monitoring services

### Phase 4: Market Dominance (Months 10-12)
**Vertical Integration Completion**
- [ ] Battery storage installation services
- [ ] EV charger installation division
- [ ] Solar maintenance contracts
- [ ] Community solar programs
- [ ] Virtual power plant participation
- [ ] Energy trading capabilities

---

## 🔧 Development Environment

### Required Tools
- **Node.js 18+**: Modern JavaScript runtime
- **Next.js 14**: React framework for web app
- **ArkadeOS TypeScript SDK**: Payment integration
- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions

### Quick Start Commands
```bash
# Navigate to Solar Strive project
cd /Volumes/Bitcoin/plebmoe/solar-strive

# Install ArkadeOS SDK
npm install @arkade/typescript-sdk

# Start development environment
npm install && npm run dev

# Database setup
docker-compose up -d postgres redis

# Run migrations
npm run migrate

# Test ArkadeOS integration
npm run test:payments
```

### ArkadeOS Integration Resources
- **Main Platform**: https://arkade.money
- **Documentation**: https://docs.arkadeos.com/
- **GitHub Organization**: https://github.com/arkade-os
- **TypeScript SDK**: https://arkade-os.github.io/ts-sdk/
- **Live Testing**: Baltic Honeybadger 2025 proven in production

---

## 📊 Success Metrics

### Technical KPIs
- **Payment Processing**: Sub-second escrow releases via ArkadeOS
- **Lightning Integration**: Seamless wallet compatibility
- **Attribution Accuracy**: 99%+ QR scan tracking
- **Platform Uptime**: 99.9% availability

### Business KPIs
- **Lead-to-Install Conversion**: Full pipeline conversion rates
- **Employee Productivity**: Projects per team member
- **Customer Acquisition Cost**: Total cost per installation
- **Average System Size**: kW installed per project
- **Time to Installation**: Days from lead to commissioning

### Solar Industry Impact
- **Vertical Integration**: Complete control of customer experience
- **Quality Assurance**: In-house teams ensure installation standards
- **Price Optimization**: No third-party installer markups
- **Customer Trust**: Single company accountability
- **Market Efficiency**: Streamlined sales-to-installation process

---

## 🔗 Integration with PlebMoe Ecosystem

Solar Strive connects to the broader PlebMoe ecosystem through:

**Content Strategy Integration:**
- **Money Balcony**: Energy independence, Bitcoin store of value
- **Mental Balcony**: Low time preference, sovereignty mindset
- **Media Balcony**: Signal vs noise in energy markets

**Cross-Initiative Synergies:**
- **Better Boat Brokers**: High-value asset transactions
- **Penn Quarter Rules**: Community debate and education
- **Proof Of Putt**: Gamified Bitcoin adoption
- **Premium Spas**: Lifestyle networking venues

**Unified Attribution:**
- QR codes from PlebMoe wormhole portal can drive Solar Strive conversions
- Cross-platform user tracking and recommendation engine
- Shared Bitcoin payment infrastructure via ArkadeOS

---

*This documentation serves as the technical foundation for Solar Strive - a vertically integrated solar company that handles everything from lead generation through installation under one roof. The ArkadeOS integration enables Bitcoin-native payments while maintaining complete control over the customer journey.*

**Own the entire stack. Control the experience. Deliver solar at scale.**