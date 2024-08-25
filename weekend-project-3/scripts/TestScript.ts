import { parse } from "dotenv";
import { viem } from "hardhat";
import { parseEther, formatEther, toHex } from "viem";
import hre from "hardhat";

import {
  abi,
  bytecode,
} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

async function main() {
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2] = await viem.getWalletClients();
  const MINT_VALUE = parseEther("100");

  console.log("deployer", deployer.account.address);

  // Deploy MyToken contract
  const myTokenContract = await viem.deployContract("MyToken");
  console.log(`Token contract deployed at ${myTokenContract.address}\n`);

  // Mint 100 Tokens to accounts
  [deployer, acc1, acc2].map(async (acc) => {
    const mintTx = await myTokenContract.write.mint([
      acc.account.address,
      MINT_VALUE,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });

    const balanceBN = await myTokenContract.read.balanceOf([
      acc.account.address,
    ]);
    console.log(`Minted 100 tokens to ${acc.account.address}`);
    console.log(
      `Account ${acc.account.address} has now ${formatEther(
        balanceBN
      )} of MyToken\n`
    );
  });

  // delegate Voting to accounts

  [deployer, acc1, acc2].map(async (acc) => {
    const delegateTx = await myTokenContract.write.delegate(
      [acc.account.address],
      {
        account: acc.account,
      }
    );
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await myTokenContract.read.getVotes([
      acc.account.address,
    ]);
    console.log(
      `Account ${
        acc.account.address
      } has ${votesAfter.toString()} units of voting power after self delegating\n`
    );
  });

  // // delegate all Voting Power to deployer
  // [deployer, acc1, acc2].map(async (acc) => {
  //   const delegateTx = await contract.write.delegate(
  //     [deployer.account.address],
  //     {
  //       account: acc.account,
  //     }
  //   );
  //   await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  //   const votesAfter = await contract.read.getVotes([acc.account.address]);
  //   console.log(
  //     `Account ${
  //       acc.account.address
  //     } has ${votesAfter.toString()} units of voting power after delegating to deployer\n`
  //   );
  // });

  // deploy TokenizedBallot contract

  const blockNumberBefore = await publicClient.getBlockNumber();
  console.log("Block number before:", blockNumberBefore);

  const blocksToIncrease = 10;
  await hre.network.provider.send("hardhat_mine", [toHex(blocksToIncrease)]);

  const blockNumber = await publicClient.getBlockNumber();
  console.log("Block number after:", blockNumber);

  const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"];

  console.log("\nDeploying Ballot contract");
  const ballotContract = await viem.deployContract("TokenizedBallot", [
    proposals.map((prop) => toHex(prop, { size: 32 })),
    myTokenContract.address,
    blockNumber - 1n,
  ]);
  console.log("Ballot contract deployed to:", ballotContract.address);

  //account1 vote for Proposal 1
  const getPastVotes = await myTokenContract.read.getPastVotes([
    acc1.account.address,
    blockNumber - 1n,
  ]);

  console.log("getPastVotes", formatEther(getPastVotes));

  const votingPowerBefore = await ballotContract.read.getVotingPower([
    acc1.account.address,
  ]);

  console.log(
    `Account ${
      acc1.account.address
    } has ${votingPowerBefore.toString()} units of voting power before voting\n`
  );
  const voteTx = await ballotContract.write.vote([0n, parseEther("100")], {
    account: acc1.account,
  });
  const voteReceipt = await publicClient.waitForTransactionReceipt({
    hash: voteTx,
  });

  const votingPowerAfter = await ballotContract.read.getVotingPower([
    acc1.account.address,
  ]);
  console.log(
    `Account ${
      acc1.account.address
    } has ${votingPowerAfter.toString()} units of voting power in the ballot contract AFTER VOTE\n`
  );

  // pick winning proposal
  const winningProposal = await ballotContract.read.winningProposal();
  console.log("Winning proposal is:", winningProposal.toString());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
