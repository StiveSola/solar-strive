// ArkadeOS Integration for Solar Strive
// Handles VTXO payments, escrow, and Lightning Network integration

import { SingleKey, Wallet } from '@arkade-os/sdk';

export interface ArkadeConfig {
  esploraUrl: string;
  arkServerUrl: string;
  privateKey?: string;
}

export interface JobEscrow {
  jobId: string;
  paymentAmount: number; // in sats
  materialOwnerId: string;
  placerId: string;
  locationId: string;
  vtxoId?: string;
  conditions: EscrowConditions;
}

export interface EscrowConditions {
  requirePhotoProof: boolean;
  requireLocationVerification: boolean;
  autoReleaseAfterHours?: number;
  verificationRequired: boolean;
}

export class SolarStriveArkade {
  private wallet: Wallet | null = null;
  private config: ArkadeConfig;

  constructor(config: ArkadeConfig) {
    this.config = {
      esploraUrl: config.esploraUrl || process.env.NEXT_PUBLIC_ESPLORA_URL || 'https://mutinynet.com/api',
      arkServerUrl: config.arkServerUrl || process.env.NEXT_PUBLIC_ARKADE_SERVER_URL || 'https://mutinynet.arkade.sh',
      ...config
    };
  }

  /**
   * Initialize the Arkade wallet with a private key or generate a new one
   */
  async initialize(privateKeyHex?: string): Promise<void> {
    try {
      let identity: SingleKey;

      if (privateKeyHex) {
        identity = SingleKey.fromHex(privateKeyHex);
      } else {
        // Generate new key for demo/testing
        identity = SingleKey.generate();
        console.log('⚠️ Generated new private key for testing:', identity.toHex());
      }

      this.wallet = await Wallet.create({
        identity,
        esploraUrl: this.config.esploraUrl,
        arkServerUrl: this.config.arkServerUrl,
      });

      console.log('✅ Arkade wallet initialized successfully');
      console.log('🏦 Wallet address:', await this.wallet.getReceiveAddress());

    } catch (error) {
      console.error('❌ Failed to initialize Arkade wallet:', error);
      throw error;
    }
  }

  /**
   * Get wallet information
   */
  async getWalletInfo() {
    if (!this.wallet) throw new Error('Wallet not initialized');

    try {
      const address = await this.wallet.getReceiveAddress();
      const balance = await this.wallet.getBalance();

      return {
        address,
        balance: {
          confirmed: balance.confirmed,
          unconfirmed: balance.unconfirmed,
          total: balance.confirmed + balance.unconfirmed
        }
      };
    } catch (error) {
      console.error('❌ Failed to get wallet info:', error);
      throw error;
    }
  }

  /**
   * Create escrow for a job payment using VTXO
   */
  async createJobEscrow(escrow: JobEscrow): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not initialized');

    try {
      console.log('🔒 Creating escrow for job:', escrow.jobId);

      // For now, we'll use a basic send transaction
      // In production, this would use programmable VTXOs with conditions
      const txid = await this.wallet.send({
        to: await this.generateEscrowAddress(escrow),
        amount: escrow.paymentAmount
      });

      console.log('✅ Escrow created with VTXO:', txid);
      return txid;

    } catch (error) {
      console.error('❌ Failed to create job escrow:', error);
      throw error;
    }
  }

  /**
   * Release escrow payment when conditions are met
   */
  async releaseEscrow(vtxoId: string, recipientAddress: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not initialized');

    try {
      console.log('🔓 Releasing escrow:', vtxoId);

      // In production, this would trigger the VTXO release conditions
      // For now, we simulate with a direct payment
      const txid = await this.wallet.send({
        to: recipientAddress,
        amount: 0 // Amount would be determined from VTXO
      });

      console.log('✅ Escrow released:', txid);
      return txid;

    } catch (error) {
      console.error('❌ Failed to release escrow:', error);
      throw error;
    }
  }

  /**
   * Handle Lightning Network payments via submarine swaps
   */
  async payLightning(invoice: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not initialized');

    try {
      console.log('⚡ Processing Lightning payment...');

      // Use Arkade's Lightning integration
      const result = await this.wallet.payInvoice(invoice);

      console.log('✅ Lightning payment successful:', result);
      return result.paymentHash;

    } catch (error) {
      console.error('❌ Lightning payment failed:', error);
      throw error;
    }
  }

  /**
   * Generate multi-party payment distribution
   */
  async distributeRevenue(
    totalAmount: number,
    splits: {
      materialOwner: string;  // 40%
      placer: string;         // 15%
      locationOwner: string;  // 10%
      partner: string;        // 15% (Powur)
      platform: string;       // 10%
      verificationFund: string; // 10%
    }
  ): Promise<string[]> {
    if (!this.wallet) throw new Error('Wallet not initialized');

    try {
      console.log('💰 Distributing revenue:', totalAmount, 'sats');

      const distributions = [
        { address: splits.materialOwner, amount: Math.floor(totalAmount * 0.40) },
        { address: splits.placer, amount: Math.floor(totalAmount * 0.15) },
        { address: splits.locationOwner, amount: Math.floor(totalAmount * 0.10) },
        { address: splits.partner, amount: Math.floor(totalAmount * 0.15) },
        { address: splits.platform, amount: Math.floor(totalAmount * 0.10) },
        { address: splits.verificationFund, amount: Math.floor(totalAmount * 0.10) },
      ];

      const txids: string[] = [];

      for (const dist of distributions) {
        if (dist.amount > 0) {
          const txid = await this.wallet.send({
            to: dist.address,
            amount: dist.amount
          });
          txids.push(txid);
        }
      }

      console.log('✅ Revenue distribution complete:', txids.length, 'transactions');
      return txids;

    } catch (error) {
      console.error('❌ Revenue distribution failed:', error);
      throw error;
    }
  }

  /**
   * Generate escrow address (placeholder implementation)
   */
  private async generateEscrowAddress(escrow: JobEscrow): Promise<string> {
    // In production, this would create a programmable VTXO address
    // based on the escrow conditions
    return await this.wallet!.getReceiveAddress();
  }

  /**
   * Check if wallet is ready
   */
  isReady(): boolean {
    return this.wallet !== null;
  }

  /**
   * Get raw wallet instance for advanced operations
   */
  getWallet(): Wallet | null {
    return this.wallet;
  }
}

// Export singleton instance
export const arkade = new SolarStriveArkade({
  esploraUrl: process.env.NEXT_PUBLIC_ESPLORA_URL!,
  arkServerUrl: process.env.NEXT_PUBLIC_ARKADE_SERVER_URL!
});

// Export types
export type { ArkadeConfig, JobEscrow, EscrowConditions };