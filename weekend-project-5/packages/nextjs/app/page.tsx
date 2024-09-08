'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// ABI and contract address
const CONTRACT_ADDRESS = '0x75FE17F10400016478EE6818BcDe173f7A2E2430' // Replace with your contract address
const CONTRACT_ABI = '/home/pitycake/web3pitycake/finallottery/encode-projects-group-3/weekend-project-5/packages/hardhat/deployments/sepolia/Lottery.json' // Replace with your contract ABI'

export default function LotteryPage() {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string>('')

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = provider.getSigner()
          const address = await (await signer).getAddress()
          setAccount(address)

          const lotteryContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
          setContract(lotteryContract)
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
      console.error("Contract is not initialized.")
      return
    }
    try {
      const tx = await contract.purchaseTokens({ value: ethers.parseEther("1") }) // Adjust ETH amount if needed
      await tx.wait()
      console.log('Tokens purchased successfully')
    } catch (error) {
      console.error("Error purchasing tokens:", error)
    }
  }

  const placeBet = async (option: string) => {
    if (!contract) {
      console.error("Contract is not initialized.")
      return
    }
    try {
      const tx = await contract.placeBet(option === 'Argentina' ? 0 : 1)
      await tx.wait()
      console.log('Bet placed successfully')
    } catch (error) {
      console.error("Error placing bet:", error)
    }
  }

  const withdrawPrize = async () => {
    if (!contract) {
      console.error("Contract is not initialized.")
      return
    }
    try {
      const tx = await contract.withdrawPrize(ethers.parseEther("1")) // Adjust prize amount if needed
      await tx.wait()
      console.log('Prize withdrawn successfully')
    } catch (error) {
      console.error("Error withdrawing prize:", error)
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Lottery dApp</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Connected Account: {account}</p>

      <div style={{ marginBottom: '20px' }}>
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
            backgroundColor: '#FF5722', 
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
            backgroundColor: '#2196F3', 
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
