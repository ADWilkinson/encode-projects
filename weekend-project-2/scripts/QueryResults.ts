import { createPublicClient, hexToString, http } from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from '../artifacts/contracts/Ballot.sol/Ballot.json';
import * as dotenv from 'dotenv';
import { privateKeyToAccount } from 'viem/accounts';

dotenv.config();

// env variables
const providerApiKey = process.env.ALCHEMY_API_KEY || '';

async function main() {
  // Get arguments from the command
  const parameters = process.argv.slice(2);

  // validate the parameters
  if (!parameters || parameters.length < 1)
    throw new Error('Parameters not provided');

  // validate the contract address
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error('Contract address not provided');

  // validate that the address respect evm address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error('Invalid contract address');

  // initiate a public to read data from the chain
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const winnerName = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'winnerName',
  })) as any;

  console.log('The winner proposal is:', hexToString(winnerName, { size: 32 }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
