//@ts-nocheck
/** 
 * @Author Andrew Wilkinson
 1) Copy to hardhatProjectRoot/scripts
 2) Run with: ('voter address' 'contract address')
    npx ts-node --files ./scripts/ReadVoters.ts '0x30B0D5758c79645Eb925825E1Ee8A2c448812F37' '0x36CE6412d063e157cFb6F95C93d5940eaCAc708E'
*/
import { createPublicClient, http, hexToString } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
require("dotenv").config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {
  let voterAddress = process.argv.slice(2)[0];
  let contractAddress = process.argv.slice(2)[1];
  console.log(voterAddress, contractAddress);
  if (!voterAddress && !contractAddress) throw "No address or contract provided";

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  try {
    const voterDetails = (await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "voters",
      args: [voterAddress],
    })) as any[];

    console.log(voterDetails);
  } catch (error) {
    console.log("Failed fetching voter");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* 
  Outputs:
    [ 1n, false, '0x0000000000000000000000000000000000000000', 0n ]
*/
