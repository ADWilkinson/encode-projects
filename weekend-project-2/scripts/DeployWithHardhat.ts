import {
  formatEther,
  createPublicClient,
  createWalletClient,
  http,
  toHex,
  hexToString,
} from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { abi, bytecode } from '../artifacts/contracts/Ballot.sol/Ballot.json';
import * as dotenv from 'dotenv';

dotenv.config();

// env variables
const providerApiKey = process.env.ALCHEMY_API_KEY || '';
const deployerPrivateKey = process.env.PRIVATE_KEY || '';

async function main() {
  // Get arguments passed on command
  const proposals = process.argv.slice(2);

  // validate the existance of the arguments
  if (!proposals || proposals.length < 1)
    throw new Error('Proposals not provided');

  // create a public client to read data from the chain
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // create a wallet client to be able to send transactions to the chain
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  // Display the deployer's address
  console.log('Deployer address:', deployer.account.address);

  // Read the deployer's wallet balance from the chain
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  // Display the deployer's balance
  console.log(
    'Deployer balance:',
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  // Execute the deployment transaction
  console.log('\nDeploying Ballot contract');
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
  });

  // Display the transaction hash
  console.log('Transaction hash:', hash);


  console.log('Waiting for confirmations...');
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Display the address of the newly deployed contract once the transaction is complete
  console.log('Ballot contract deployed to:', receipt.contractAddress);

  // Read the list of proposals on the deployec contract from the chain
  console.log('Proposals: ');
  for (let index = 0; index < proposals.length; index++) {
    const proposal = (await publicClient.readContract({
      address: receipt.contractAddress!,
      abi,
      functionName: 'proposals',
      args: [BigInt(index)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log({ index, name, proposal });
  }

  // Display the wallet balance after deployment and gas fees
  // Read the deployer's wallet balance from the chain
  const balanceAfter = await publicClient.getBalance({
    address: deployer.account.address,
  });
  // Display the deployer's balance
  console.log(
    'Deployer balance:',
    formatEther(balanceAfter),
    deployer.chain.nativeCurrency.symbol
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
