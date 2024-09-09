'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const LOTTERY_ADDRESS = '0x75FE17F10400016478EE6818BcDe173f7A2E2430';
const LOTTERY_TOKEN_ADDRESS = '0x1c00F02994eD69C4845FDaF182215eA1a819Fd2C';

// Define constants for the enum values
const BET_OPTIONS = {
  Argentina: 'Argentina',
  Brazil: 'Brazil',
};

export default function LotteryPage() {
  const [lotteryContract, setLotteryContract] = useState<ethers.Contract | null>(null);
  const [lotteryTokenContract, setLotteryTokenContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<string>('');
  const [betsClosingTime, setBetsClosingTime] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const { abi: LOTTERY_ABI } = await import('./Lottery.json') as unknown as { abi: string };
          const LOTTERY_TOKEN_ABI = (await import('./LotteryToken.json')).default;

          const lottery = new ethers.Contract(LOTTERY_ADDRESS, LOTTERY_ABI, signer);
          setLotteryContract(lottery);

          const lotteryToken = new ethers.Contract(LOTTERY_TOKEN_ADDRESS, LOTTERY_TOKEN_ABI, signer);
          setLotteryTokenContract(lotteryToken);

          // Fetch and display the token balance
          const balance = await lotteryToken.balanceOf(address);
          setTokenBalance(ethers.formatUnits(balance, 18)); // Assuming 18 decimals

          // Fetch and format betsClosingTime
          const closingTime = await lottery.betsClosingTime();
          setBetsClosingTime(closingTime.toString()); // Convert to string for display

        } catch (error) {
          setError(`Initialization Error: ${(error as Error).message}`);
          console.error("An error occurred:", error);
        }
      } else {
        setError('Please install MetaMask!');
      }
    };

    init();
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const purchaseTokens = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!lotteryContract) {
      setError("Contract is not initialized.");
      return;
    }

    try {
      const value = ethers.parseEther(amount);
      const tx = await lotteryContract.purchaseTokens({ value });
      await tx.wait();

      console.log('Tokens purchased successfully');
    } catch (error) {
      setError(`Error purchasing tokens: ${(error as Error).message}`);
      console.error("Error purchasing tokens:", error);
    }
  };

  const placeBet = async (option: 'Argentina' | 'Brazil') => {
    if (!lotteryContract) {
      setError("Contract is not initialized.");
      return;
    }
    try {
      // Convert the option to enum index
      const optionIndex = option === 'Argentina' ? 0 : 1;
      const tx = await lotteryContract.placeBet(optionIndex);
      await tx.wait();
      console.log('Bet placed successfully');
    } catch (error) {
      setError(`Error placing bet: ${(error as Error).message}`);
      console.error("Error placing bet:", error);
    }
  };

  const withdrawPrize = async () => {
    if (!lotteryContract) {
      setError("Contract is not initialized.");
      return;
    }
    try {
      const tx = await lotteryContract.withdrawPrize(ethers.parseEther("1")); // Adjust prize amount if needed
      await tx.wait();
      console.log('Prize withdrawn successfully');
    } catch (error) {
      setError(`Error withdrawing prize: ${(error as Error).message}`);
      console.error("Error withdrawing prize:", error);
    }
  };

  // Calculate the countdown time
  const getTimeLeft = () => {
    if (!betsClosingTime) return 'Calculating...';
    const closingTimeDate = new Date(parseInt(betsClosingTime) * 1000); // Convert from seconds to milliseconds
    const timeLeft = closingTimeDate.getTime() - new Date().getTime();
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Lottery dApp</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Connected Account: {account}</p>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        Token Balance: {tokenBalance} LOTTERY
      </p>

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

      <div style={{ marginTop: '20px', fontSize: '1.2rem' }}>
        <p>Time Left Until Bets Close:</p>
        <p>{getTimeLeft()}</p>
      </div>
    </div>
  );
}
