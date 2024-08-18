import { createPublicClient, createWalletClient, formatEther, http } from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from '../artifacts/contracts/Ballot.sol/Ballot.json';
import * as dotenv from 'dotenv';
import { privateKeyToAccount } from 'viem/accounts';

dotenv.config();

// env variables
const providerApiKey = process.env.ALCHEMY_API_KEY || '';
const voterPrivateKey = process.env.PRIVATE_KEY_1 || '';

async function main() {
	// Get arguments from the command
	const parameters = process.argv.slice(2);

	// validate the parameters
	if (!parameters || parameters.length < 2)
		throw new Error('Parameters not provided');

	// validate the contract address
	const contractAddress = parameters[0] as `0x${string}`;
	if (!contractAddress) throw new Error('Contract address not provided');

	// validate that the address respect evm address format
	if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
		throw new Error('Invalid contract address');

	// validate the existance of new voter address
	const newDelegate = parameters[1];
	if (!newDelegate) throw new Error('Voter address not provided');

	// validate the format of the new voter address
	if (!/^(0x)?[0-9a-fA-F]{40}$/.test(newDelegate))
		throw new Error('Invalid user address');

	// initiate a public to read data from the chain
	const publicClient = createPublicClient({
		chain: sepolia,
		transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
	});

	// create a wallet client to be able to send transactions to the chain
	const account = privateKeyToAccount(`0x${voterPrivateKey}`);
	const voter = createWalletClient({
		account,
		chain: sepolia,
		transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
	});

	// Display the voter's address
  console.log('Voter address:', voter.account.address);

  // Read the voter's wallet balance from the chain
  const balance = await publicClient.getBalance({
    address: voter.account.address,
  });
  // Display the voter's balance
  console.log(
    'Voter balance:',
    formatEther(balance),
    voter.chain.nativeCurrency.symbol
  );

	console.log(
		'Are sure you want to delegate your voting rights to:',
		newDelegate
	);
	console.log('Confirm? (Y/n)');

	process.stdin.on('data', async function (d) {
		if (d.toString().trim().toLowerCase() != 'n') {
			const hash = await voter.writeContract({
				address: contractAddress,
				abi,
				functionName: 'delegate',
				args: [newDelegate],
			});
			console.log('Transaction hash:', hash);
			console.log('Waiting for confirmations...');
			const receipt = await publicClient.waitForTransactionReceipt({ hash });
			console.log('Transaction confirmed');
		} else {
			console.log('Operation cancelled');
		}
		process.exit();
	});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
