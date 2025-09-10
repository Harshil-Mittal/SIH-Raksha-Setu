# RakshaSetu Blockchain Module

A comprehensive blockchain solution for digital identity management in the RakshaSetu ecosystem. This module provides secure, decentralized digital identity management using Ethereum smart contracts.

## 🌟 Features

### 🔐 Digital Identity Management
- **Secure Identity Creation**: Create digital identities on the blockchain
- **Identity Verification**: Admin-controlled identity verification system
- **Role Management**: Dynamic role assignment and management
- **Privacy Protection**: Sensitive data is hashed before storage
- **QR Code Integration**: Generate and validate QR codes for identity verification

### 💼 Wallet Management
- **Wallet Generation**: Create new Ethereum wallets
- **Wallet Recovery**: Recover wallets using mnemonic phrases
- **Balance Tracking**: Monitor wallet balances and transaction history
- **Secure Storage**: Encrypt/decrypt private keys with passwords

### ⛓️ Smart Contract Integration
- **DigitalID Contract**: Comprehensive identity management smart contract
- **Event Logging**: Track all identity-related events
- **Gas Optimization**: Efficient contract design for cost-effective operations
- **Multi-Network Support**: Deploy on local, testnet, and mainnet

### 🔒 Security Features
- **Private Key Protection**: Never expose private keys in API responses
- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: Prevent abuse with configurable rate limits
- **Error Handling**: Secure error handling without information leakage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Hardhat for smart contract development
- Ethereum node (local or remote)

### Installation

1. **Install Dependencies**
   ```bash
   cd blockchain
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Compile Smart Contracts**
   ```bash
   npm run compile
   ```

4. **Deploy Contracts**
   ```bash
   # Local deployment
   npm run deploy:local
   
   # Testnet deployment
   npm run deploy:testnet
   
   # Mainnet deployment
   npm run deploy:mainnet
   ```

5. **Start Blockchain API**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
blockchain/
├── contracts/                 # Smart contracts
│   └── DigitalID.sol         # Main digital identity contract
├── scripts/                  # Deployment scripts
│   └── deploy.ts             # Contract deployment script
├── src/                      # TypeScript source code
│   ├── contracts/            # Contract interfaces
│   ├── routes/               # API route handlers
│   ├── services/             # Business logic services
│   ├── middleware/           # Express middleware
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── test/                     # Test files
├── hardhat.config.ts         # Hardhat configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔧 API Endpoints

### Wallet Management
- `POST /api/blockchain/wallet/generate` - Generate new wallet
- `GET /api/blockchain/wallet/:address` - Get wallet information

### Digital Identity
- `POST /api/blockchain/identity/create` - Create digital identity
- `GET /api/blockchain/identity/wallet/:address` - Get identity by wallet
- `GET /api/blockchain/identity/:id` - Get identity by ID
- `PUT /api/blockchain/identity/:id` - Update identity
- `POST /api/blockchain/identity/:id/verify` - Verify identity
- `POST /api/blockchain/identity/:id/deactivate` - Deactivate identity

### Role Management
- `POST /api/blockchain/identity/:id/roles` - Add role to identity
- `GET /api/blockchain/identity/:id/roles` - Get identity roles

### QR Code & Verification
- `POST /api/blockchain/identity/:id/qr` - Generate QR code data
- `POST /api/blockchain/qr/validate` - Validate QR code data

### Statistics & Monitoring
- `GET /api/blockchain/stats` - Get blockchain statistics
- `GET /api/blockchain/verification-queue` - Get verification queue

## 🛠️ Smart Contract

### DigitalID Contract

The main smart contract for managing digital identities:

```solidity
contract DigitalID {
    struct Identity {
        uint256 id;
        string name;
        string email;
        string nationality;
        string aadhaarHash;
        string passportHash;
        string emergencyContact;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
        bool isVerified;
        address walletAddress;
        string[] roles;
    }
}
```

### Key Functions

- `createIdentity()` - Create new digital identity
- `updateIdentity()` - Update existing identity
- `verifyIdentity()` - Verify identity (admin only)
- `deactivateIdentity()` - Deactivate identity
- `addRole()` / `removeRole()` - Manage identity roles
- `getIdentityByWallet()` - Retrieve identity by wallet address

## 🔐 Security Considerations

### Data Privacy
- Sensitive data (Aadhaar, Passport) is hashed before storage
- Private keys are never exposed in API responses
- All inputs are validated and sanitized

### Access Control
- Identity owners can only modify their own identities
- Admin functions are restricted to contract owner
- Role-based access control for different operations

### Gas Optimization
- Efficient contract design minimizes gas costs
- Batch operations where possible
- Optimized data structures

## 🌐 Network Support

### Local Development
- Hardhat local network (chainId: 1337)
- Ganache for testing
- Local node deployment

### Testnets
- Goerli testnet
- Sepolia testnet
- Custom testnet support

### Mainnet
- Ethereum mainnet
- Polygon mainnet (future)
- Other EVM-compatible chains

## 📊 Monitoring & Analytics

### Blockchain Statistics
- Total identities created
- Active vs inactive identities
- Verification status tracking
- Transaction volume monitoring

### Health Monitoring
- API health checks
- Blockchain connectivity status
- Contract deployment status
- Gas price monitoring

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Contract Tests
```bash
npx hardhat test
```

## 🚀 Deployment

### Local Deployment
```bash
# Start local node
npx hardhat node

# Deploy contracts
npm run deploy:local
```

### Testnet Deployment
```bash
# Set up testnet configuration
export GOERLI_RPC_URL="your_rpc_url"
export PRIVATE_KEY="your_private_key"

# Deploy to testnet
npm run deploy:testnet
```

### Production Deployment
```bash
# Set up mainnet configuration
export MAINNET_RPC_URL="your_rpc_url"
export PRIVATE_KEY="your_private_key"

# Deploy to mainnet
npm run deploy:mainnet
```

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
BLOCKCHAIN_PORT=3002
NODE_ENV=development

# Blockchain Configuration
BLOCKCHAIN_RPC_URL=http://localhost:8545
CHAIN_ID=1337
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key

# Gas Configuration
GAS_LIMIT=500000
GAS_PRICE=20

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

## 🔄 Integration

### Frontend Integration
```typescript
import { BlockchainAPI } from '@raksha-setu/blockchain';

const blockchainAPI = new BlockchainAPI({
  baseURL: 'http://localhost:3002/api/blockchain'
});

// Create digital identity
const identity = await blockchainAPI.createIdentity({
  name: 'John Doe',
  email: 'john@example.com',
  nationality: 'Indian',
  emergencyContact: '+91-9876543210',
  roles: ['tourist']
});
```

### Backend Integration
```typescript
import { DigitalIDService } from '@raksha-setu/blockchain';

const digitalIDService = new DigitalIDService(
  blockchainService,
  walletService
);

// Get user identity
const identity = await digitalIDService.getDigitalIdentity(walletAddress);
```

## 📈 Performance

### Optimization Features
- Efficient smart contract design
- Batch operations support
- Caching for frequently accessed data
- Rate limiting to prevent abuse

### Scalability
- Modular architecture
- Independent blockchain module
- Easy integration with any frontend
- Support for multiple networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Roadmap

- [ ] Multi-chain support (Polygon, BSC)
- [ ] NFT-based identity certificates
- [ ] Zero-knowledge proof integration
- [ ] Mobile wallet integration
- [ ] Advanced analytics dashboard
- [ ] Identity federation support
- [ ] Cross-chain identity verification

---

**RakshaSetu Blockchain Module** - Secure, decentralized digital identity management ⛓️🔐
