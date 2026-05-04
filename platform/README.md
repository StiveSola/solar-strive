# Solar Strive - Decentralized Gig Economy Platform

**Bitcoin-first micro-services platform for solar marketing through crowdsourced material placement**

![Solar Strive Architecture](https://img.shields.io/badge/Architecture-Microservices-blue) ![ArkadeOS](https://img.shields.io/badge/Payments-ArkadeOS-orange) ![Next.js](https://img.shields.io/badge/Frontend-Next.js-black) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Mapbox Account (for maps)
- ArkadeOS Account (for Bitcoin payments)

### Installation

1. **Clone and Navigate**
   ```bash
   cd solar-strive
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual configuration
   ```

3. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb solar_strive

   # Run migrations
   cd backend
   npm run migrate
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend API
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 🏗️ Architecture Overview

### Microservices Structure

```
solar-strive/
├── frontend/           # Next.js React application
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utility libraries (ArkadeOS, etc)
│   └── pages/         # Application pages
├── backend/           # Express.js API server
│   ├── services/      # Business logic services
│   ├── routes/        # API endpoint definitions
│   └── middleware/    # Authentication, validation, etc
├── database/          # PostgreSQL schemas and migrations
└── contracts/         # ArkadeOS smart contracts
```

### Key Technologies

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, PostgreSQL, Redis
- **Payments**: ArkadeOS TypeScript SDK for Bitcoin/Lightning
- **Maps**: Mapbox GL JS with real-time location tracking
- **Database**: PostgreSQL with PostGIS for geographic data

## ⚡ ArkadeOS Integration

### Bitcoin Payment Features

- **VTXO Escrow**: Programmable payment conditions for jobs
- **Lightning Integration**: Instant payouts via submarine swaps
- **Revenue Distribution**: Automated multi-stakeholder payments
- **Micro-Payments**: Attribution rewards for QR scans

### Payment Flow Example

```typescript
// Create job escrow
const vtxoId = await arkadePaymentService.createJobEscrow({
  jobId: 'job123',
  materialOwnerId: 'owner456',
  placerId: 'placer789',
  paymentAmountSats: 1000,
  conditions: {
    requirePhotoProof: true,
    requireGpsVerification: true,
    verifierRequired: true
  }
});

// Release payment when conditions met
const txId = await arkadePaymentService.releaseJobEscrow(
  'job123',
  vtxoId,
  placerAddress,
  {
    photoProof: true,
    gpsVerified: true,
    verifierApproved: true
  }
);
```

## 🗺️ Interactive Map Features

### Real-Time Location Management

- **Dynamic Markers**: Color-coded by availability status
- **Clustering**: Automatic grouping for dense areas
- **Filtering**: By payment range, distance, surface type
- **Mobile Responsive**: Touch-optimized interface

### Location Types Supported

- Cork boards for business cards
- Glass windows for flyers
- Magnetic surfaces for removable materials
- Counter displays for high-visibility placement

## 💼 User Roles & Workflows

### Material Owners (Solar Companies)
1. Purchase marketing materials with QR attribution codes
2. Fund placement jobs using ArkadeOS escrow
3. Monitor campaign performance and conversions
4. Track ROI through Powur integration

### Placers (Field Workers)
1. Find available locations on interactive map
2. Accept placement jobs with Bitcoin payments
3. Install materials and provide photo proof
4. Earn reputation scores for quality work

### Verifiers (Quality Assurance)
1. Perform periodic material checks
2. Photograph current state and count materials
3. Earn micro-payments for verification services
4. Report issues for material replacement

### Location Owners (Businesses)
1. Register properties for material placement
2. Set pricing and availability rules
3. Receive portion of placement fees
4. Monitor what materials are on their property

## 📊 Revenue Distribution Model

When a QR scan converts to a sale:

- **40%** → Material Owner (campaign ROI)
- **15%** → Placer (attribution bonus)
- **10%** → Location Owner (facility fee)
- **15%** → Powur Partnership
- **10%** → Platform Fee
- **10%** → Verification Fund

## 🔧 Development Commands

### Frontend Commands
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

### Backend Commands
```bash
cd backend
npm run dev        # Start with ts-node (hot reload)
npm run start:dev  # Start with file watching
npm run build      # Compile TypeScript to JavaScript
npm run start      # Start production server
npm run migrate    # Run database migrations
npm run seed       # Seed database with test data
```

## 🌍 Environment Configuration

### Required Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...
NEXT_PUBLIC_ARKADE_SERVER_URL=https://mutinynet.arkade.sh
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/solar_strive
ARKADE_MASTER_PRIVATE_KEY=your_platform_wallet_key
MAPBOX_ACCESS_TOKEN=pk.ey...
POWUR_API_KEY=your_powur_api_key
JWT_SECRET=your_jwt_secret
```

## 🚀 Deployment

### Production Deployment

1. **Build Applications**
   ```bash
   cd frontend && npm run build
   cd backend && npm run build
   ```

2. **Database Setup**
   ```bash
   # Run migrations on production database
   DATABASE_URL=your_prod_db npm run migrate
   ```

3. **Deploy Services**
   - Frontend: Deploy to Vercel/Netlify
   - Backend: Deploy to Railway/Render/AWS
   - Database: PostgreSQL on Supabase/AWS RDS
   - Redis: Redis Cloud/AWS ElastiCache

### Docker Deployment (Optional)

```bash
# Build and start all services
docker-compose up --build

# Services available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Database: localhost:5432
# Redis: localhost:6379
```

## 📱 Mobile Support

The platform is fully mobile-responsive with:

- Touch-optimized map interactions
- Mobile-first dashboard design
- Camera integration for photo proof
- GPS verification for location accuracy
- Progressive Web App (PWA) capabilities

## 🔗 Integration Partners

### Powur Solar Network
- Lead submission API integration
- Contractor assignment automation
- Commission tracking and attribution
- Site survey scheduling with upfront payments

### ArkadeOS Platform
- Bitcoin wallet integration
- Lightning Network payments
- Programmable escrow contracts
- Submarine swap automation

## 📈 Roadmap

### Phase 1: Solar MVP (Current)
- ✅ Core platform architecture
- ✅ ArkadeOS payment integration
- ✅ Interactive map interface
- ✅ Basic job management
- 🔄 Powur API integration

### Phase 2: Advanced Features
- [ ] AI-powered material verification
- [ ] Advanced analytics dashboard
- [ ] Reputation scoring system
- [ ] Mobile app (React Native)

### Phase 3: White-Label Framework
- [ ] Configuration-driven industry templates
- [ ] Multi-tenant architecture
- [ ] Partner integration APIs

### Phase 4: Industry Expansion
- [ ] Festival promotion platform
- [ ] Restaurant marketing implementation
- [ ] Real estate lead generation

## 🔐 Security Features

- **Authentication**: JWT-based user authentication
- **Payment Security**: Self-custody Bitcoin wallets
- **Data Protection**: Encrypted sensitive data storage
- **Rate Limiting**: API endpoint protection
- **CORS Protection**: Cross-origin request security

## 🧪 Testing

```bash
# Run tests (when implemented)
cd frontend && npm test
cd backend && npm test

# Type checking
cd frontend && npm run type-check
cd backend && npm run type-check
```

## 📝 API Documentation

### Core Endpoints

- `GET /api/locations` - Fetch available locations
- `POST /api/jobs` - Create new placement jobs
- `POST /api/payments/escrow` - Create payment escrow
- `POST /api/campaigns` - Launch marketing campaigns
- `GET /api/analytics` - Fetch performance metrics

Full API documentation available at `/api/docs` when server is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: See `/docs` directory for detailed guides
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discord**: Join our community for real-time support

---

**Built with ⚡ by the Solar Strive team using Bitcoin & ArkadeOS**

*Empowering the circular economy through decentralized work and Bitcoin payments*