import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, toBeHex } from "ethers";
import { MyToken, TokenizedBallot } from "../typechain-types";
import { createPublicClient, toHex, createClient } from "viem";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */

const BALLOT_PROPOSALS = [
  toHex("Brazil", { size: 32 }),
  toHex("Argentina", { size: 32 }),
  toHex("Chile", { size: 32 }),
];

const TOKEN_ADDRESS = "0x0AAFeB206dE1A21f030B4Bad4A598c128bd09a75";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const blockNumber = await hre.ethers.provider.getBlockNumber();

  await deploy("TokenizedBallot", {
    from: deployer,
    // Contract constructor arguments
    args: [BALLOT_PROPOSALS, TOKEN_ADDRESS, BigInt(blockNumber - 1)],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const ballotContract = await hre.ethers.getContract<TokenizedBallot>("TokenizedBallot", deployer);
  console.log("👋 Ballot Proposal:", await ballotContract.proposals(0n));
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["TokenizedBallot"];
