# Weekend Project 2

### Project instructions

This is a group activity for at least 3 students:

- Develop and run scripts for “Ballot.sol” within your group to give voting rights, casting votes, delegating votes and querying results
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
- Submit your weekend project by filling the form provided in Discord
- Submit your code in a github repository in the form

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

1. ✅ **[Success]:** Deployed `Ballot.sol` smart contract on Sepolia testnet
    1. `npx ts-node --files scripts/DeployWithHardhat.ts taco-1 burger-2 sushi-3 pasta-4`
    2. [TxHash (0x09c...d6b73)](https://sepolia.etherscan.io/tx/0x09c017519e5e18ba1670fb9e9b7bfa9fafd144b4c4a637192338f8a8a5fd6b73)
    3. [Script ↗](./scripts/DeployWithHardhat.ts)
    4. [Output ↗](./outputs/DeployWithHardhat.md)

    ---
    
2. ✅ **[Success]:** Call `vote` function
    1. `npx ts-node --files scripts/CastVote.ts 0x5c78da9eefd99d17a9108aa79bcf6cb15ba4175e 2`
    2. [TxHash (0x8162...f5c4a)](https://sepolia.etherscan.io/tx/0x81625d7206e3f3874cecaa5edd48868dd852134eeb2fc730e33ee637136f5c4a)
    3. [Script ↗](./scripts/CastVote.ts)
    4. [Output ↗](./outputs/CastVote.md)
    
    ---
    
3. ✅ **[Succes]:** Call `giveRightToVote` function from the chairman address
    1. `npx ts-node --files scripts/GiveVotingRight.ts 0x5c78da9eefd99d17a9108aa79bcf6cb15ba4175e 0x32375e74E0B68Bcd6eD8cB0178C8a440c73Ea3dd`
    2. [TxHash (0xe75...36a95)](https://sepolia.etherscan.io/tx/0xe75a55923bd022705c7e2cd8fced5997a9177e5a4d21ee3f8e25758f72d36a95)
    3. [Script ↗](./scripts/GiveVotingRight.ts)
    4. [Output ↗](./outputs/GiveVotingRight.md)
    
> 💡Trying to call this function and giving as argument an address not part of voters will revert with an unknown reason message.

---

    
4. ✅ **[Succes]:** Call `delegateVote` function
    1. `npx ts-node --files scripts/DelegateVote.ts 0x5C78Da9EEfD99D17A9108Aa79bcf6cb15Ba4175e 0x4D4aDC611349Dd4A9851A7b450f46bF4a7008A04`
    2. [TxHash (0xf6f...13310)](https://sepolia.etherscan.io/tx/0xf6fc977b1178f14ec429ca9ca697ac05bf9bbd3d867626a6cbd44e04e6113310)
    3. [Script ↗](./scripts/DelegateVote.ts)
    4. [Output ↗](./outputs/DelegateVote.md)
    
    ---
    
5. ✅ **[Success]:** Call `winnerName` view function
    1. `npx ts-node --files scripts/QueryResults.ts 0x5C78Da9EEfD99D17A9108Aa79bcf6cb15Ba4175e`
    2. [Script ↗](./scripts/QueryResults.ts)
    3. [Output ↗](./outputs/QueryResults.md)
