-- Solar Strive Database Schema v1.0
-- Includes ArkadeOS VTXO integration for Bitcoin payments and escrow

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- User Management with Bitcoin Keys
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),

    -- Bitcoin/Arkade wallet information
    arkade_public_key VARCHAR(66), -- Compressed public key
    arkade_address VARCHAR(100),   -- Bitcoin address
    lightning_address VARCHAR(255), -- Lightning address for payouts

    -- User role flags
    is_material_owner BOOLEAN DEFAULT false,
    is_placer BOOLEAN DEFAULT false,
    is_verifier BOOLEAN DEFAULT false,
    is_location_scout BOOLEAN DEFAULT false,
    is_location_owner BOOLEAN DEFAULT false,

    -- Reputation and verification
    reputation_score DECIMAL(5,2) DEFAULT 0.00,
    verification_level INTEGER DEFAULT 0, -- 0=unverified, 1=phone, 2=id, 3=background
    total_jobs_completed INTEGER DEFAULT 0,
    total_earnings_sats BIGINT DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Location Management with GIS and ArkadeOS Integration
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Geographic information
    coordinates POINT NOT NULL, -- PostGIS point (longitude, latitude)
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'US',
    zip_code VARCHAR(20),

    -- Location details
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    surface_type surface_type_enum NOT NULL,
    holder_type holder_type_enum NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 1,
    current_count INTEGER DEFAULT 0,

    -- Location owner information
    owner_id UUID REFERENCES users(id),
    owner_contact_info JSONB,

    -- Pricing and availability
    hourly_rate_sats INTEGER NOT NULL DEFAULT 0,
    daily_rate_sats INTEGER,
    weekly_rate_sats INTEGER,
    monthly_rate_sats INTEGER,
    availability_status availability_status_enum DEFAULT 'available',

    -- ArkadeOS integration for payments
    arkade_contract_id VARCHAR(255), -- VTXO contract for location payments
    arkade_owner_address VARCHAR(100), -- Owner's Arkade address for payments

    -- Quality and reputation
    reputation_score DECIMAL(3,2) DEFAULT 0.00,
    total_placements INTEGER DEFAULT 0,
    successful_conversions INTEGER DEFAULT 0,

    -- Discovery information
    discovered_by UUID REFERENCES users(id),
    discovery_reward_sats INTEGER DEFAULT 0,

    -- Verification and photos
    verification_photos TEXT[],
    last_verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create enums for location types
CREATE TYPE surface_type_enum AS ENUM (
    'cork_board',
    'glass_window',
    'magnetic_surface',
    'wall_mount',
    'counter_display',
    'outdoor_board',
    'digital_display'
);

CREATE TYPE holder_type_enum AS ENUM (
    'business_card_only',
    'flyer_only',
    'both_formats',
    'brochure_rack',
    'custom_display'
);

CREATE TYPE availability_status_enum AS ENUM (
    'available',
    'occupied',
    'pending_placement',
    'maintenance',
    'temporarily_unavailable',
    'permanently_closed'
);

-- Job Management with ArkadeOS Escrow
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type job_type_enum NOT NULL,

    -- Job relationships
    location_id UUID NOT NULL REFERENCES locations(id),
    material_owner_id UUID NOT NULL REFERENCES users(id),
    assigned_placer_id UUID REFERENCES users(id),
    assigned_verifier_id UUID REFERENCES users(id),

    -- Job details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    materials_count INTEGER NOT NULL DEFAULT 1,
    estimated_duration_hours DECIMAL(4,2),

    -- Payment and escrow via ArkadeOS
    payment_amount_sats INTEGER NOT NULL,
    bonus_amount_sats INTEGER DEFAULT 0,
    arkade_escrow_vtxo VARCHAR(255), -- Escrow VTXO identifier
    arkade_release_conditions JSONB, -- Programmable release conditions
    arkade_material_owner_address VARCHAR(100),
    arkade_placer_address VARCHAR(100),

    -- Job status and workflow
    status job_status_enum DEFAULT 'open',
    priority_level INTEGER DEFAULT 1, -- 1=low, 5=urgent

    -- Requirements and conditions
    photo_proof_required BOOLEAN DEFAULT true,
    gps_verification_required BOOLEAN DEFAULT true,
    time_window_start TIME,
    time_window_end TIME,
    valid_days_of_week INTEGER[], -- 0=Sunday, 6=Saturday

    -- Completion tracking
    proof_images TEXT[],
    completion_notes TEXT,
    gps_coordinates POINT,
    completed_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Quality assurance
    quality_score DECIMAL(3,2),
    quality_notes TEXT,

    -- Payment tracking
    escrow_created_at TIMESTAMP WITH TIME ZONE,
    payment_released_at TIMESTAMP WITH TIME ZONE,
    release_transaction_id VARCHAR(255),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create enums for job management
CREATE TYPE job_type_enum AS ENUM (
    'placement',
    'verification',
    'removal',
    'replacement',
    'maintenance',
    'quality_check'
);

CREATE TYPE job_status_enum AS ENUM (
    'open',
    'assigned',
    'in_progress',
    'pending_verification',
    'completed',
    'disputed',
    'cancelled',
    'expired'
);

-- Material Campaigns with Attribution Tracking
CREATE TABLE material_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_name VARCHAR(255) NOT NULL,

    -- Campaign owner
    material_owner_id UUID NOT NULL REFERENCES users(id),

    -- Campaign details
    material_type VARCHAR(100) NOT NULL, -- 'business_card', 'flyer', 'brochure'
    design_url TEXT,
    qr_code_data TEXT NOT NULL,
    attribution_id VARCHAR(30) UNIQUE NOT NULL,

    -- Powur integration
    powur_campaign_id VARCHAR(100),
    powur_affiliate_id VARCHAR(100),
    target_conversion_goal INTEGER,

    -- Budget and payments via ArkadeOS
    total_budget_sats INTEGER NOT NULL,
    spent_budget_sats INTEGER DEFAULT 0,
    arkade_budget_vtxo VARCHAR(255), -- Campaign budget VTXO

    -- Campaign performance
    total_placements INTEGER DEFAULT 0,
    total_scans INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    conversion_revenue_cents INTEGER DEFAULT 0,

    -- Campaign timing
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,

    -- Geographic targeting
    target_regions JSONB, -- Geographic boundaries for placements
    excluded_regions JSONB,

    -- Campaign status
    status campaign_status_enum DEFAULT 'draft',

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TYPE campaign_status_enum AS ENUM (
    'draft',
    'active',
    'paused',
    'completed',
    'cancelled'
);

-- QR Code Scan Tracking with Attribution
CREATE TABLE qr_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Attribution tracking
    attribution_id VARCHAR(30) NOT NULL,
    campaign_id UUID REFERENCES material_campaigns(id),
    location_id UUID REFERENCES locations(id),
    placer_id UUID REFERENCES users(id),

    -- Scan details
    scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,

    -- Geographic information
    scan_coordinates POINT,
    scan_city VARCHAR(100),
    scan_country VARCHAR(50),

    -- Conversion tracking
    lead_captured BOOLEAN DEFAULT false,
    lead_captured_at TIMESTAMP WITH TIME ZONE,
    conversion_completed BOOLEAN DEFAULT false,
    conversion_completed_at TIMESTAMP WITH TIME ZONE,
    conversion_value_cents INTEGER,

    -- Powur integration
    powur_lead_id VARCHAR(100),
    powur_conversion_id VARCHAR(100),

    -- Attribution payments via ArkadeOS
    attribution_payment_sats INTEGER DEFAULT 0,
    arkade_attribution_txid VARCHAR(255),
    attribution_paid_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue Distribution Tracking
CREATE TABLE revenue_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Source of revenue
    source_type revenue_source_enum NOT NULL,
    source_id UUID NOT NULL, -- ID of qr_scan, job, etc.
    total_amount_sats INTEGER NOT NULL,

    -- ArkadeOS transaction details
    arkade_distribution_vtxo VARCHAR(255),
    distribution_transactions JSONB, -- Array of {recipient, amount, txid}

    -- Stakeholder distributions (percentages from config)
    material_owner_amount_sats INTEGER,
    placer_amount_sats INTEGER,
    location_owner_amount_sats INTEGER,
    partner_amount_sats INTEGER, -- Powur
    platform_amount_sats INTEGER,
    verification_fund_amount_sats INTEGER,

    -- Distribution status
    status distribution_status_enum DEFAULT 'pending',
    distributed_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE revenue_source_enum AS ENUM (
    'qr_scan',
    'lead_conversion',
    'installation_completion',
    'verification_bonus',
    'referral_bonus'
);

CREATE TYPE distribution_status_enum AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'disputed'
);

-- Create indexes for performance
CREATE INDEX idx_locations_coordinates ON locations USING GIST (coordinates);
CREATE INDEX idx_locations_availability ON locations (availability_status);
CREATE INDEX idx_locations_owner ON locations (owner_id);

CREATE INDEX idx_jobs_location ON jobs (location_id);
CREATE INDEX idx_jobs_status ON jobs (status);
CREATE INDEX idx_jobs_material_owner ON jobs (material_owner_id);
CREATE INDEX idx_jobs_placer ON jobs (assigned_placer_id);

CREATE INDEX idx_qr_scans_attribution ON qr_scans (attribution_id);
CREATE INDEX idx_qr_scans_timestamp ON qr_scans (scanned_at);
CREATE INDEX idx_qr_scans_location ON qr_scans (location_id);

CREATE INDEX idx_revenue_distributions_source ON revenue_distributions (source_type, source_id);
CREATE INDEX idx_revenue_distributions_status ON revenue_distributions (status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_campaigns_updated_at BEFORE UPDATE ON material_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_distributions_updated_at BEFORE UPDATE ON revenue_distributions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();