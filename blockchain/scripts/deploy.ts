import { ethers } from 'hardhat';
import { logger } from '../src/utils/logger';

async function main() {
  console.log('🚀 Starting DigitalID contract deployment...');

  // Get the contract factory
  const DigitalID = await ethers.getContractFactory('DigitalID');
  
  // Deploy the contract
  console.log('📄 Deploying DigitalID contract...');
  const digitalID = await DigitalID.deploy();
  
  // Wait for deployment to complete
  await digitalID.waitForDeployment();
  
  const contractAddress = await digitalID.getAddress();
  
  console.log('✅ DigitalID contract deployed successfully!');
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Transaction Hash: ${digitalID.deploymentTransaction()?.hash}`);
  
  // Verify deployment
  console.log('🔍 Verifying deployment...');
  const owner = await digitalID.owner();
  const totalIdentities = await digitalID.getTotalIdentities();
  
  console.log(`👤 Contract Owner: ${owner}`);
  console.log(`📊 Total Identities: ${totalIdentities}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    transactionHash: digitalID.deploymentTransaction()?.hash,
    owner,
    deployedAt: new Date().toISOString(),
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString()
  };
  
  console.log('📋 Deployment Information:');
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Instructions for environment setup
  console.log('\n🔧 Environment Setup:');
  console.log(`Add the following to your .env file:`);
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`CHAIN_ID=${deploymentInfo.chainId}`);
  
  logger.info('Contract deployed successfully', deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    logger.error('Contract deployment failed', { error: error.message });
    process.exit(1);
  });
