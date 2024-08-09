#### Weekend Project 1

### Project instructions

This is a group activity for at least 3 students:

- Interact with “HelloWorld.sol” within your group to change message strings and change owners
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
- Submit your weekend project by filling the form provided in Discord

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

1. ✅ **[Success]:** Deployed `HelloWorld.sol` smart contract on Sepolia testnet
    1. [TxHash (0x81ece...e4d6e)](https://sepolia.etherscan.io/tx/0x81ece8c5a1b61f93eaa4692c43a8af74501ff30a71391a8db4407fc3c54e4d6e)
    
    ---
    
2. ✅ **[Success]:** Call `setText` function
    1. [TxHash (0x0078...2b0f)](https://sepolia.etherscan.io/tx/0x0078ea0f83844e89b5e8b64e5dfa3f879514b92b2071950f738415a6a3d02b0f)
    2. State change
    
    | Storage Address | 0x0000000000000000000000000000000000000000000000000000000000000000 |
    | --------------- | ------------------------------------------------------------------ |
    | Before          | TextHello World                                                    |
    | After           | TextNew test                                                       |
    
    ---
    
3. ✅ **[Succes]:** Call `transferOwnership` function from the appropriate owner’s address
    1. [TxHash (0x6139...ca76c)](https://sepolia.etherscan.io/tx/0x6139ffa8ff2c6283bb76271a8500234fe3c4480a6871d25be537a397689ca76c)
    2. State change
    
    | Storage Address | 0x0000000000000000000000000000000000000000000000000000000000000001 |
    | --------------- | ------------------------------------------------------------------ |
    | Before          | 0x30b0d5758c79645eb925825e1ee8a2c448812f37                         |
    | After           | 0x59bf1bbd4f0ead5704865f52c906eb588b7b7f7d                         |
    
    c.  After the successful execution of this transaction, no address should be able to call `setText` or `transferOwnership` beside the new owner address `0x59bf1…b7f7d`
    
    ---
    
4. ❌ **[Reverted]**: Call `setText` function from the previous owner’s address
    1. [TxHash (0x02c3…8a689)](https://sepolia.etherscan.io/tx/0x02c352832337765e371073f1a6a52fa3b8f2919478d69d31c3593a5ef1d8a689)
    2. **Reason for failure:** 
    **Fail with error 'Caller is not the owner'**
    since the address initiating this transaction is no longer the owner of the contract, the modifier `onlyOwner` tests whether the address initiating the call matches the address stored in state as the owner reverts the transaction.
    
    ---
    
5. ❌ **[Reverted]:** Call `transferOwnership` function from the previous owner’s address
    1. [TxHash (0x02c3…8a689)](https://sepolia.etherscan.io/tx/0x02c352832337765e371073f1a6a52fa3b8f2919478d69d31c3593a5ef1d8a689)
    2. **Reason for failure:
    Fail with error 'Caller is not the owner'**
    since the address initiating this transaction is no longer the owner of the contract, the modifier `onlyOwner` tests whether the address initiating the call matches the address stored in state as the owner reverts the transaction.
