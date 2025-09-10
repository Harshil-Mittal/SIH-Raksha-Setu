export interface IdentityData {
  id: number;
  name: string;
  email: string;
  nationality: string;
  aadhaarHash: string;
  passportHash: string;
  emergencyContact: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVerified: boolean;
  walletAddress: string;
  roles: string[];
}

export interface CreateIdentityRequest {
  name: string;
  email: string;
  nationality: string;
  aadhaarHash?: string;
  passportHash?: string;
  emergencyContact: string;
  roles: string[];
}

export interface UpdateIdentityRequest {
  name: string;
  email: string;
  nationality: string;
  emergencyContact: string;
}

export interface BlockchainConfig {
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
  contractABI: any;
  chainId: number;
  gasLimit?: number;
  gasPrice?: string;
}

export interface TransactionResult {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface WalletInfo {
  address: string;
  balance: string;
  nonce: number;
}

export interface ContractEvent {
  event: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
}

export interface IdentityVerification {
  identityId: number;
  verifierAddress: string;
  verificationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export interface RoleManagement {
  identityId: number;
  role: string;
  action: 'add' | 'remove';
  timestamp: Date;
  transactionHash: string;
}

export interface BlockchainStats {
  totalIdentities: number;
  activeIdentities: number;
  verifiedIdentities: number;
  totalTransactions: number;
  lastBlockNumber: number;
  contractAddress: string;
}

export interface DigitalIDContract {
  createIdentity(
    name: string,
    email: string,
    nationality: string,
    aadhaarHash: string,
    passportHash: string,
    emergencyContact: string,
    roles: string[]
  ): Promise<any>;

  updateIdentity(
    id: number,
    name: string,
    email: string,
    nationality: string,
    emergencyContact: string
  ): Promise<any>;

  getIdentityByWallet(walletAddress: string): Promise<IdentityData>;

  getIdentityById(id: number): Promise<IdentityData>;

  hasIdentity(walletAddress: string): Promise<boolean>;

  verifyIdentity(id: number): Promise<any>;

  deactivateIdentity(id: number): Promise<any>;

  addRole(id: number, role: string): Promise<any>;

  removeRole(id: number, roleIndex: number): Promise<any>;

  getTotalIdentities(): Promise<number>;

  getIdentityRoles(id: number): Promise<string[]>;

  hasRole(id: number, role: string): Promise<boolean>;
}
