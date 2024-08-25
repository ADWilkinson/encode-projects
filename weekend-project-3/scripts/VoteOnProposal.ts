import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

const BALLOT_CONTRACT = "0x9177dca2e3cbffbd545d9555d7faf7b490293a79";
const FAVORITE_PROPOSAL = 0n;
const VOTES = parseEther("100");

async function main() {
  const publicClient = await viem.getPublicClient();
  const myTokenContract = await viem.getContractAt(
    "TokenizedBallot",
    BALLOT_CONTRACT
  );
  //   console.log(myTokenContract);

  const voteTx = await myTokenContract.write.vote([FAVORITE_PROPOSAL, VOTES]);
  const voteTxReceipt = await publicClient.waitForTransactionReceipt({
    hash: voteTx,
  });
  console.log(voteTxReceipt);

  console.log(
    "Voted ",
    formatEther(VOTES),
    "for proposal",
    Number(FAVORITE_PROPOSAL)
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
