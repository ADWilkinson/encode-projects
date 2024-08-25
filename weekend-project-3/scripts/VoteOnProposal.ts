import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

const BALLOT_CONTRACT = "0xf359BDdfb633EFD1c8247107224d5B6a2A0D5f05";
const FAVORITE_PROPOSAL = 1n;
const VOTES = parseEther("5");

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
