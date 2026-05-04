// ArkadeOS Payment Service for Solar Strive Backend
// Handles VTXO escrow, Lightning payments, and revenue distribution

import { SingleKey, Wallet } from '@arkade-os/sdk';

export interface PaymentConfig {
  esploraUrl: string;
  arkServerUrl: string;
  masterPrivateKey: string; // Platform wallet key
}

export interface EscrowJob {
  jobId: string;
  materialOwnerId: string;
  placerId: string;
  locationId: string;
  paymentAmountSats: number;
  conditions: {
    requirePhotoProof: boolean;
    requireGpsVerification: boolean;
    autoReleaseHours?: number;
    verifierRequired: boolean;
  };
}

export interface RevenueDistribution {
  totalAmountSats: number;
  materialOwnerSats: number;
  placerSats: number;
  locationOwnerSats: number;
  partnerSats: number; // Powur
  platformSats: number;
  verificationFundSats: number;
}

export class ArkadePaymentService {
  private wallet: Wallet | null = null;
  private config: PaymentConfig;
  private activeEscrows: Map<string, any> = new Map();

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  /**
   * Initialize the Arkade payment service with platform wallet
   */
  async initialize(): Promise<void> {
    try {
      const identity = SingleKey.fromHex(this.config.masterPrivateKey);

      this.wallet = await Wallet.create({
        identity,
        esploraUrl: this.config.esploraUrl,
        arkServerUrl: this.config.arkServerUrl,
      });

      const address = await this.wallet.getReceiveAddress();
      const balance = await this.wallet.getBalance();

      console.log('✅ Arkade Payment Service initialized');
      console.log('🏦 Platform wallet address:', address);
      console.log('💰 Platform balance:', balance.confirmed + balance.unconfirmed, 'sats');

    } catch (error) {
      console.error('❌ Failed to initialize Arkade Payment Service:', error);
      throw error;
    }
  }

  /**
   * Create escrow for job payment using programmable VTXO
   */
  async createJobEscrow(escrow: EscrowJob): Promise<string> {
    if (!this.wallet) throw new Error('Payment service not initialized');

    try {
      console.log('🔒 Creating job escrow:', escrow.jobId);

      // In production, this would create a programmable VTXO with conditions
      // For now, we'll simulate by holding funds in platform wallet

      // Store escrow details
      this.activeEscrows.set(escrow.jobId, {
        ...escrow,
        createdAt: new Date(),
        status: 'locked',
        vtxoId: `vtxo_${escrow.jobId}_${Date.now()}`
      });

      // In real implementation, this would:
      // 1. Create VTXO with programmable release conditions
      // 2. Lock funds until conditions are met
      // 3. Return the VTXO ID for tracking

      const vtxoId = `vtxo_${escrow.jobId}_${Date.now()}`;
      console.log('✅ Job escrow created with VTXO:', vtxoId);

      return vtxoId;

    } catch (error) {
      console.error('❌ Failed to create job escrow:', error);
      throw error;
    }
  }

  /**
   * Release escrow payment when job conditions are verified
   */
  async releaseJobEscrow(
    jobId: string,
    vtxoId: string,
    placerAddress: string,
    verificationData: {
      photoProof: boolean;
      gpsVerified: boolean;
      verifierApproved: boolean;
    }
  ): Promise<string> {
    if (!this.wallet) throw new Error('Payment service not initialized');

    try {
      console.log('🔓 Releasing job escrow:', vtxoId);

      const escrow = this.activeEscrows.get(jobId);
      if (!escrow) {
        throw new Error('Escrow not found');
      }

      // Verify all conditions are met
      if (escrow.conditions.requirePhotoProof && !verificationData.photoProof) {
        throw new Error('Photo proof required but not provided');
      }

      if (escrow.conditions.requireGpsVerification && !verificationData.gpsVerified) {
        throw new Error('GPS verification required but not provided');
      }

      if (escrow.conditions.verifierRequired && !verificationData.verifierApproved) {
        throw new Error('Verifier approval required but not provided');
      }

      // Release payment to placer
      const txid = await this.wallet.send({
        to: placerAddress,
        amount: escrow.paymentAmountSats
      });

      // Update escrow status
      this.activeEscrows.set(jobId, {
        ...escrow,
        status: 'released',
        releasedAt: new Date(),
        releaseTransactionId: txid
      });

      console.log('✅ Escrow released to placer:', txid);
      return txid;

    } catch (error) {
      console.error('❌ Failed to release job escrow:', error);
      throw error;
    }
  }

  /**
   * Process Lightning Network payment via submarine swap
   */
  async processLightningPayment(invoice: string): Promise<string> {
    if (!this.wallet) throw new Error('Payment service not initialized');

    try {
      console.log('⚡ Processing Lightning payment...');

      const result = await this.wallet.payInvoice(invoice);

      console.log('✅ Lightning payment successful:', result);
      return result.paymentHash;

    } catch (error) {
      console.error('❌ Lightning payment failed:', error);
      throw error;
    }
  }

  /**
   * Distribute revenue from solar conversions to all stakeholders
   */
  async distributeRevenue(
    sourceId: string,
    totalAmountSats: number,
    addresses: {
      materialOwner: string;
      placer: string;
      locationOwner: string;
      partner: string; // Powur
      platform: string;
      verificationFund: string;
    }
  ): Promise<RevenueDistribution & { transactionIds: string[] }> {
    if (!this.wallet) throw new Error('Payment service not initialized');

    try {
      console.log('💰 Distributing revenue:', totalAmountSats, 'sats from source:', sourceId);

      // Calculate distribution amounts based on Solar Strive model
      const distribution: RevenueDistribution = {
        totalAmountSats,
        materialOwnerSats: Math.floor(totalAmountSats * 0.40), // 40%
        placerSats: Math.floor(totalAmountSats * 0.15),        // 15%
        locationOwnerSats: Math.floor(totalAmountSats * 0.10), // 10%
        partnerSats: Math.floor(totalAmountSats * 0.15),       // 15% Powur
        platformSats: Math.floor(totalAmountSats * 0.10),      // 10%
        verificationFundSats: Math.floor(totalAmountSats * 0.10) // 10%
      };

      const transactions = [
        { address: addresses.materialOwner, amount: distribution.materialOwnerSats, label: 'Material Owner' },
        { address: addresses.placer, amount: distribution.placerSats, label: 'Placer' },
        { address: addresses.locationOwner, amount: distribution.locationOwnerSats, label: 'Location Owner' },
        { address: addresses.partner, amount: distribution.partnerSats, label: 'Partner (Powur)' },
        { address: addresses.platform, amount: distribution.platformSats, label: 'Platform' },
        { address: addresses.verificationFund, amount: distribution.verificationFundSats, label: 'Verification Fund' },
      ];

      const transactionIds: string[] = [];

      // Execute all payments
      for (const tx of transactions) {
        if (tx.amount > 0) {
          try {
            const txid = await this.wallet.send({
              to: tx.address,
              amount: tx.amount
            });
            transactionIds.push(txid);
            console.log(`💸 Paid ${tx.amount} sats to ${tx.label}: ${txid}`);
          } catch (error) {
            console.error(`❌ Failed to pay ${tx.label}:`, error);
            // In production, implement retry logic and error handling
          }
        }
      }

      console.log('✅ Revenue distribution completed:', transactionIds.length, 'transactions');

      return {
        ...distribution,
        transactionIds
      };

    } catch (error) {
      console.error('❌ Revenue distribution failed:', error);
      throw error;
    }
  }

  /**
   * Pay micro-reward for QR scan attribution
   */
  async payAttributionReward(
    scanId: string,
    placerAddress: string,
    amountSats: number = 10 // Default 10 sat micro-payment
  ): Promise<string> {
    if (!this.wallet) throw new Error('Payment service not initialized');

    try {
      console.log('📱 Paying attribution reward for scan:', scanId);

      const txid = await this.wallet.send({
        to: placerAddress,
        amount: amountSats
      });

      console.log(`✅ Attribution reward paid: ${amountSats} sats to ${placerAddress}`);
      return txid;

    } catch (error) {
      console.error('❌ Attribution reward payment failed:', error);
      throw error;
    }
  }

  /**
   * Get platform wallet balance
   */
  async getWalletBalance(): Promise<{ confirmed: number; unconfirmed: number; total: number }> {
    if (!this.wallet) throw new Error('Payment service not initialized');

    const balance = await this.wallet.getBalance();
    return {
      confirmed: balance.confirmed,
      unconfirmed: balance.unconfirmed,
      total: balance.confirmed + balance.unconfirmed
    };
  }

  /**
   * Get platform wallet address for funding
   */
  async getPlatformAddress(): Promise<string> {
    if (!this.wallet) throw new Error('Payment service not initialized');
    return await this.wallet.getReceiveAddress();
  }

  /**
   * Get escrow status
   */
  getEscrowStatus(jobId: string): any | null {
    return this.activeEscrows.get(jobId) || null;
  }

  /**
   * List all active escrows
   */
  listActiveEscrows(): Array<any> {
    return Array.from(this.activeEscrows.values());
  }

  /**
   * Health check for payment service
   */
  async healthCheck(): Promise<{ status: string; balance: number; activeEscrows: number }> {
    try {
      const balance = await this.getWalletBalance();
      return {
        status: 'healthy',
        balance: balance.total,
        activeEscrows: this.activeEscrows.size
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        balance: 0,
        activeEscrows: 0
      };
    }
  }
}

// Export singleton instance (will be initialized in app startup)
export let arkadePaymentService: ArkadePaymentService;

export function initializePaymentService(config: PaymentConfig): ArkadePaymentService {
  arkadePaymentService = new ArkadePaymentService(config);
  return arkadePaymentService;
}