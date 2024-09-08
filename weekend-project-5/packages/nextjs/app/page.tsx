'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'


// ABI and contract address
const CONTRACT_ADDRESS = '0x75FE17F10400016478EE6818BcDe173f7A2E2430'
const CONTRACT_ABI = '/home/pitycake/web3pitycake/finallottery/encode-projects-group-3/weekend-project-5/packages/hardhat/deployments/sepolia/Lottery.json' // Replace with your contract ABI'

export default function LotteryPage() {
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState('')
  const [tokenBalance, setTokenBalance] = useState('0')
  const [ethAmount, setEthAmount] = useState('')
  const [betOption, setBetOption] = useState('Argentina')
  const [prizeAmount, setPrizeAmount] = useState('')
  const [burnAmount, setBurnAmount] = useState('')
  const [ownerWithdrawAmount, setOwnerWithdrawAmount] = useState('')
  const [closingTime, setClosingTime] = useState('')

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const address = await signer.getAddress()
          setAccount(address)

          const lotteryContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
          setContract(lotteryContract)

          // Get token balance
          const balance = await lotteryContract.paymentToken().balanceOf(address)
          setTokenBalance(ethers.utils.formatEther(balance))
        } catch (error) {
          console.error("An error occurred:", error)
        }
      } else {
        console.log('Please install MetaMask!')
      }
    }

    init()
  }, [])

  const purchaseTokens = async () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }
    try {
      console.log("Attempting to purchase tokens with contract:", contract);
      const tx = await contract.purchaseTokens({ value: ethers.utils.parseEther(ethAmount) });
      await tx.wait();
      console.log('Tokens purchased successfully');
      // Update token balance
      const balance = await contract.paymentToken().balanceOf(account);
      setTokenBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error purchasing tokens:", error);
    }
  };

  const placeBet = async () => {
    try {
      const tx = await contract.placeBet(betOption === 'Argentina' ? 0 : 1)
      await tx.wait()
      console.log('Bet placed successfully')
    } catch (error) {
      console.error("Error placing bet:", error)
    }
  }

  const withdrawPrize = async () => {
    try {
      const tx = await contract.withdrawPrize(ethers.utils.parseEther(prizeAmount))
      await tx.wait()
      console.log('Prize withdrawn successfully')
    } catch (error) {
      console.error("Error withdrawing prize:", error)
    }
  }

  const burnTokens = async () => {
    try {
      const tx = await contract.returnTokens(ethers.utils.parseEther(burnAmount))
      await tx.wait()
      console.log('Tokens burned successfully')
      // Update token balance
      const balance = await contract.paymentToken().balanceOf(account)
      setTokenBalance(ethers.utils.formatEther(balance))
    } catch (error) {
      console.error("Error burning tokens:", error)
    }
  }

  const ownerWithdraw = async () => {
    try {
      const tx = await contract.ownerWithdraw(ethers.utils.parseEther(ownerWithdrawAmount))
      await tx.wait()
      console.log('Owner withdrawal successful')
    } catch (error) {
      console.error("Error in owner withdrawal:", error)
    }
  }

  const openBets = async () => {
    try {
      const tx = await contract.openBets(Math.floor(Date.now() / 1000) + parseInt(closingTime))
      await tx.wait()
      console.log('Bets opened successfully')
    } catch (error) {
      console.error("Error opening bets:", error)
    }
  }

  const closeBets = async () => {
    try {
      const tx = await contract.closeBetsAndDetermineOutcome()
      await tx.wait()
      console.log('Bets closed and outcome determined')
    } catch (error) {
      console.error("Error closing bets:", error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Lottery dApp</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Connected Account: {account}</p>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Token Balance: {tokenBalance}</p>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Purchase Tokens</h2>
        <input
          type="text"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          placeholder="Enter ETH amount"
          style={{ fontSize: '1rem', marginRight: '10px' }}
        />
        <button onClick={purchaseTokens} style={{ fontSize: '1rem' }}>Purchase Tokens</button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Place Bet</h2>
        <label style={{ display: 'block', fontSize: '1.2rem', marginBottom: '10px' }}>
          <input
            type="radio"
            value="Argentina"
            checked={betOption === 'Argentina'}
            onChange={() => setBetOption('Argentina')}
          />
          Argentina
        </label>
        <label style={{ display: 'block', fontSize: '1.2rem', marginBottom: '10px' }}>
          <input
            type="radio"
            value="Brazil"
            checked={betOption === 'Brazil'}
            onChange={() => setBetOption('Brazil')}
          />
          Brazil
        </label>
        <button onClick={placeBet} style={{ fontSize: '1rem' }}>Place Bet</button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Withdraw Prize</h2>
        <input
          type="text"
          value={prizeAmount}
          onChange={(e) => setPrizeAmount(e.target.value)}
          placeholder="Enter prize amount"
          style={{ fontSize: '1rem', marginRight: '10px' }}
        />
        <button onClick={withdrawPrize} style={{ fontSize: '1rem' }}>Withdraw Prize</button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Burn Tokens</h2>
        <input
          type="text"
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
          placeholder="Enter amount to burn"
          style={{ fontSize: '1rem', marginRight: '10px' }}
        />
        <button onClick={burnTokens} style={{ fontSize: '1rem' }}>Burn Tokens</button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Owner Withdraw</h2>
        <input
          type="text"
          value={ownerWithdrawAmount}
          onChange={(e) => setOwnerWithdrawAmount(e.target.value)}
          placeholder="Enter amount to withdraw"
          style={{ fontSize: '1rem', marginRight: '10px' }}
        />
        <button onClick={ownerWithdraw} style={{ fontSize: '1rem' }}>Owner Withdraw</button>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Open/Close Bets</h2>
        <input
          type="text"
          value={closingTime}
          onChange={(e) => setClosingTime(e.target.value)}
          placeholder="Enter closing time in seconds"
          style={{ fontSize: '1rem', marginRight: '10px' }}
        />
        <button onClick={openBets} style={{ fontSize: '1rem', marginRight: '10px' }}>Open Bets</button>
        <button onClick={closeBets} style={{ fontSize: '1rem' }}>Close Bets</button>
      </div>
    </div>
  )
}
