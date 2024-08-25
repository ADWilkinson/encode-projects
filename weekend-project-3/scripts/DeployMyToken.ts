import { viem } from "hardhat";

async function main() {
  const myTokenContract = await viem.deployContract("MyToken");
  console.log(
    `MyTokenContract ontract deployed at ${myTokenContract.address}\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
