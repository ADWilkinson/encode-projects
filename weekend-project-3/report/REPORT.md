# Weekend Project 3

### Project instructions

This is a group activity for at least 3 students:

- Complete the contracts together
- Develop and run scripts for “TokenizedBallot.sol” within your group to give voting tokens, delegating voting power, casting votes, checking vote power and querying results
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
- Submit your weekend project by filling the form provided in Discord
- Share your code in a github repo in the submission form

## Group 3

| Unique id | Discord username    |
| --------- | ------------------- |
| X1YKt0    | @JB                 |
| RQV69C    | @authorityjoel      |
| XRje8C    | @counselofthewolves |
| 05a7SN    | @Davy Jones         |
| p8Xm5I    | @Hako               |
| Kk60vy    | @phipsae            |
| GTblOQ    | @pitycake           |

## List of interactions

1. ✅ **[Success]:** Deployed `TokenizedBallot.sol` smart contract on Sepolia testnet
    1. `npx hardhat run ./scripts/DeployTokenizedBallot.ts`
    2. [TxHash (0x7b4...f0f68)](https://sepolia.etherscan.io/tx/0x7b4acadb8765e90238a00b4e8448d9de04963b418f6e1bab8aa534a64ddf0f68)
    3. [Script ↗](./scripts/DeployTokenizedBallot.ts)

    ---
    
2. ✅ **[Success]:** Deployed `MyToken.sol` smart contract on Sepolia testnet
    1. `npx hardhat run ./scripts/DeployMyToken.ts`
    2. [TxHash (0x457...39452)](https://sepolia.etherscan.io/tx/0x45790c2ac4ad586c36127ce84b19edb4d3ef8d7c9062cfae0edca099e2e39452)
    3. [Script ↗](./scripts/DeployMyToken.ts)
    
    ---
    
3. ✅ **[Success]:** Call `grantRole` function on MyToken contract
    1. `npx hardhat run ./scripts/SetMinterRoles.ts`
    2. [TxHash (0x467...c4d34)](https://sepolia.etherscan.io/tx/0x467ab65cdbd1f9e991edb46b933bfc5eefc54f8f49458a45ed3b5bba922c4d34)
    3. [Script ↗](./scripts/GiveVotingRight.ts)
    4. [Output ↗](./outputs/GiveVotingRight.md)

---
  
1. ✅ **[Success]:** Call `mint` function on MyToken contract
    1. `npx ts-node --files scripts/MintVoteTokens.ts`
    2. [TxHash (0x0c2...49611)](https://sepolia.etherscan.io/tx/0x0c21144bfa5fef48afe05a917d3cbbeeb8b2d600a701f2b07b1234c8ce649611)
    3. [Script ↗](./scripts/MintVoteTokens.ts)
    
    ---
    
2. ✅ **[Success]:** Call `delegate` function on MyToken contract
    1. `npx ts-node --files scripts/DelegateVotes.ts`
    2. [TxHash (0xcc5...f2116)](https://sepolia.etherscan.io/tx/0xcc5b3fbff5765a75c75b9a4ff12a72a03b7783992d021e062be398fe3e2f2116)
    3. [Script ↗](./scripts/DelegateVotes.ts)