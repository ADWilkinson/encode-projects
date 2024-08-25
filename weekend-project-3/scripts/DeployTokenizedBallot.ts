import { viem } from "hardhat";
import { parseEther, formatEther, toHex } from "viem";
import { hardhat, sepolia } from "viem/chains";
import hre from "hardhat";

const MY_TOKEN_CONTRACT_ADDRESS = "0xd7a198685afb81aeac0f8f8edd55856eb13f6597";
const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"];
const BLOCKS_TO_INCREASE = 10;

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
    BigInt(blockNumber),
  ]);
  console.log("Ballot contract deployed to:", ballotContract.address);
  console.log("Voting open for blocknumber:", blockNumber, "and before");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
