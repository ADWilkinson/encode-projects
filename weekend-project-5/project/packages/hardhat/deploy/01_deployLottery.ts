import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Lottery } from "../typechain-types";
import { parseEther } from "ethers";

const TOKEN_NAME = "Lottery Token";
const TOKEN_SYMBOL = "LT";
const PURCHASE_RATIO = 10n; // 1 ETH = 10 Lottery Tokens
const BET_PRICE = parseEther("1"); // 1 Lottery Token
const BET_FEE = parseEther("0.2"); // 0.2 Lottery Tokens

const deployLottery: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying Lottery contract with the account:", deployer);

  const lotteryDeployment = await deploy("Lottery", {
    from: deployer,
    args: [TOKEN_NAME, TOKEN_SYMBOL, PURCHASE_RATIO, BET_PRICE, BET_FEE],
    log: true,
    autoMine: true,
  });

  console.log("Lottery contract deployed to:", lotteryDeployment.address);

  // Get the deployed contract
  const lotteryContract = await hre.ethers.getContract<Lottery>("Lottery", deployer);

  // Verify the contract on Etherscan
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: lotteryContract.target,
        constructorArguments: [TOKEN_NAME, TOKEN_SYMBOL, PURCHASE_RATIO, BET_PRICE, BET_FEE],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }

  // Log some information about the deployed contract
  const paymentTokenAddress = await lotteryContract.paymentToken();
  console.log("Payment Token Address:", paymentTokenAddress);
  console.log("Purchase Ratio:", await lotteryContract.purchaseRatio());
  console.log("Bet Price:", await lotteryContract.betPrice());
  console.log("Bet Fee:", await lotteryContract.betFee());
};

export default deployLottery;

deployLottery.tags = ["Lottery"];
