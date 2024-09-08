'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// ABI and contract address
const LOTTERY_ADDRESS = '0x75FE17F10400016478EE6818BcDe173f7A2E2430' 
const LOTTERY_ABI = '/home/pitycake/web3pitycake/finallottery/encode-projects-group-3/weekend-project-5/packages/hardhat/deployments/sepolia/Lottery.json' 
const LOTTERY_TOKEN_ADDRESS = '0x1c00F02994eD69C4845FDaF182215eA1a819Fd2C'; 
const LOTTERY_TOKEN_ABI = '/home/pitycake/web3pitycake/finallottery/encode-projects-group-3/weekend-project-5/packages/hardhat/deployments/sepolia/LotteryToken.json'; 

export default function LotteryPage() {
  const [lotteryContract, setLotteryContract] = useState<ethers.Contract | null>(null)
  const [lotteryTokenContract, setLotteryTokenContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = provider.getSigner()
          const address = await (await signer).getAddress()
          setAccount(address)

          const lottery = new ethers.Contract(LOTTERY_ADDRESS, LOTTERY_ABI, await signer)
          setLotteryContract(lottery)

          const lotteryToken = new ethers.Contract(LOTTERY_TOKEN_ADDRESS, LOTTERY_TOKEN_ABI, await signer)
          setLotteryTokenContract(lotteryToken)
        } catch (error) {
          setError(`Initialization Error: ${(error as Error).message}`)
          console.error("An error occurred:", error)
        }
      } else {
        setError('Please install MetaMask!')
      }
    }

    init()
  }, [])

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value)
  }

  const purchaseTokens = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
  
    if (!lotteryContract) {
      setError("Contract is not initialized.")
      return
    }
  
    try {
      const value = ethers.parseEther(amount)
      const tx = await lotteryContract.purchaseTokens({ value })
      await tx.wait()
  
      console.log('Tokens purchased successfully')
    } catch (error) {
      setError(`Error purchasing tokens: ${(error as Error).message}`)
      console.error("Error purchasing tokens:", error)
    }
  }

  const placeBet = async (option: string) => {
    if (!lotteryContract) {
      setError("Contract is not initialized.")
      return
    }
    try {
      const tx = await lotteryContract.placeBet(option === 'Argentina' ? 0 : 1)
      await tx.wait()
      console.log('Bet placed successfully')
    } catch (error) {
      setError(`Error placing bet: ${(error as Error).message}`)
      console.error("Error placing bet:", error)
    }
  }

  const withdrawPrize = async () => {
    if (!lotteryContract) {
      setError("Contract is not initialized.")
      return
    }
    try {
      const tx = await lotteryContract.withdrawPrize(ethers.parseEther("1")) // Adjust prize amount if needed
      await tx.wait()
      console.log('Prize withdrawn successfully')
    } catch (error) {
      setError(`Error withdrawing prize: ${(error as Error).message}`)
      console.error("Error withdrawing prize:", error)
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Lottery dApp</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Connected Account: {account}</p>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', fontSize: '1.2rem' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={amount} 
          onChange={handleAmountChange} 
          placeholder="Amount in ETH" 
          style={{ 
            fontSize: '1rem', 
            padding: '10px', 
            margin: '10px', 
            width: '300px', 
            height: '40px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <button 
          onClick={purchaseTokens}
          style={{ 
            fontSize: '2rem', 
            padding: '20px', 
            margin: '10px', 
            width: '300px', 
            height: '80px',
            backgroundColor: '#4CAF50', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Purchase Token
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => placeBet('Brazil')}
          style={{ 
            fontSize: '2rem', 
            padding: '20px', 
            margin: '10px', 
            width: '300px', 
            height: '80px',
            backgroundImage: 'url(/path-to-brazil-flag.png)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          BET ON BRAZIL
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => placeBet('Argentina')}
          style={{ 
            fontSize: '2rem', 
            padding: '20px', 
            margin: '10px', 
            width: '300px', 
            height: '80px',
            backgroundImage: 'url(/path-to-argentina-flag.png)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          BET ON ARGENTINA
        </button>
      </div>

      <div>
        <button 
          onClick={withdrawPrize}
          style={{ 
            fontSize: '2rem', 
            padding: '20px', 
            margin: '10px', 
            width: '300px', 
            height: '80px',
            backgroundColor: '#FFC107', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          CLAIM PRIZE
        </button>
      </div>
    </div>
  )
}
