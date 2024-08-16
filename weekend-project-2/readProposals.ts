
//@ts-nocheck

/* 
 1) Copy to hardhatProjectRoot/scripts
 2) Run with:
    npx ts-node --files ./scripts/readProposals.ts '0x36CE6412d063e157cFb6F95C93d5940eaCAc708E'
*/

import { createPublicClient, http, hexToString } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
require("dotenv").config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {
  let ballotContractAddress = process.argv.slice(2).pop();
  console.log(ballotContractAddress);
  if (!ballotContractAddress || ballotContractAddress.length < 1) throw "No contract provided";

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  let index = 0;
  let hasMoreProposals = true;

  while (hasMoreProposals) {
    try {
      const proposal = (await publicClient.readContract({
        address: ballotContractAddress as `0x${string}`,
        abi,
        functionName: "proposals",
        args: [BigInt(index)],
      })) as any[];

      const name = hexToString(proposal[0], { size: 32 });
      console.log({ index, name, proposal });
      index++;
    } catch (error) {
      console.log("No more proposals to fetch.");
      hasMoreProposals = false;
    }
  }

  console.log(`Total proposals fetched: ${index}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* 

  Outputs:

    {
      index: 0,
      name: 'Proposal 1',
      proposal: [
        '0x50726f706f73616c203100000000000000000000000000000000000000000000',
        0n
        ]
    } 
    {
      index: 1,
      name: 'Proposal 2',
      proposal: [
      '0x50726f706f73616c203200000000000000000000000000000000000000000000',
      0n
      ]
    }
    {
      index: 2,
      name: 'Proposal 3',
      proposal: [
      '0x50726f706f73616c203300000000000000000000000000000000000000000000',
        0n
      ]
    }

*/
