import { viem } from "hardhat";
import { parseEther, formatEther, toHex } from "viem";
import { hardhat, sepolia } from "viem/chains";
import hre from "hardhat";

const MY_TOKEN_CONTRACT_ADDRESS = "0x1c374a02dF04BE89d0a268B58ED9B71D2e8F64ea";
const proposals = ["Brazil", "Argentina", "Chile"];
const BLOCKS_TO_INCREASE = 10n;

async function main() {
  console.log("\nDeploying Ballot contract");
  const publicClient = await viem.getPublicClient();
  let blockNumber = await publicClient.getBlockNumber();
  const actualChainId = await publicClient.getChainId();

  console.log("Block number before:", blockNumber);
  if (hardhat.id === Number(actualChainId)) {
    console.log(actualChainId);
    await hre.network.provider.send("hardhat_mine", [
      toHex(BLOCKS_TO_INCREASE),
    ]);
    blockNumber = await publicClient.getBlockNumber();
  }
  console.log("Block number after:", blockNumber);
  const ballotContract = await viem.deployContract("TokenizedBallot", [
    proposals.map((prop) => toHex(prop, { size: 32 })),
    MY_TOKEN_CONTRACT_ADDRESS,
    BigInt(blockNumber - 1n),
  ]);
  console.log("Ballot contract deployed to:", ballotContract.address);
  console.log("Voting open for blocknumber:", blockNumber, "and before");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
