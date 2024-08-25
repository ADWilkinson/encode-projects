import { viem } from "hardhat";

const NEW_MINTER_ADDRESS = "0xd7a198685afb81aeac0f8f8edd55856eb13f6597";
const MY_TOKEN_CONTRACT_ADDRESS = "0xd7a198685afb81aeac0f8f8edd55856eb13f6597";

async function main() {
  const publicClient = await viem.getPublicClient();
  const myTokenContract = await viem.getContractAt(
    "MyToken",
    MY_TOKEN_CONTRACT_ADDRESS
  );
  //   console.log(myTokenContract);

  const minterRole = await myTokenContract.read.MINTER_ROLE();

  const grantRoleTx = await myTokenContract.write.grantRole([
    NEW_MINTER_ADDRESS,
    minterRole,
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
