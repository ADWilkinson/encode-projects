import { viem } from "hardhat";
import { parseEther } from "viem";

// const NEW_VOTING_TOKEN_ADDRESS = "0xd7a198685afb81aeac0f8f8edd55856eb13f6597";
const MY_TOKEN_CONTRACT_ADDRESS = "0xd7a198685afb81aeac0f8f8edd55856eb13f6597";

async function main() {
  const publicClient = await viem.getPublicClient();
  const MINT_AMOUNT = parseEther("100");
  const myTokenContract = await viem.getContractAt(
    "MyToken",
    MY_TOKEN_CONTRACT_ADDRESS
  );

  const [account] = await viem.getWalletClients();

  console.log(account.account.address);

  const grantRoleTx = await myTokenContract.write.mint([
    account.account.address,
    MINT_AMOUNT,
  ]);
  const grantRoleTxReceipt = await publicClient.waitForTransactionReceipt({
    hash: grantRoleTx,
  });
  console.log(grantRoleTxReceipt);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
