import { viem } from "hardhat";
import { toHex } from "viem";
const NEW_MINTER_ADDRESS = "0x59BF1bBd4f0EaD5704865F52c906EB588B7b7f7d";
const MY_TOKEN_CONTRACT_ADDRESS = "0x1c374a02dF04BE89d0a268B58ED9B71D2e8F64ea";

async function main() {
  const publicClient = await viem.getPublicClient();
  const myTokenContract = await viem.getContractAt(
    "MyToken",
    MY_TOKEN_CONTRACT_ADDRESS
  );
  //   console.log(myTokenContract);

  const minterRole = await myTokenContract.read.MINTER_ROLE();

  const grantRoleTx = await myTokenContract.write.grantRole([
    minterRole,
    NEW_MINTER_ADDRESS,
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
