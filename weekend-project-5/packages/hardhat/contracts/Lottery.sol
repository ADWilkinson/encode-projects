// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { LotteryToken } from "./LotteryToken.sol";

contract Lottery is Ownable {
	LotteryToken public paymentToken;
	uint256 public purchaseRatio;
	uint256 public betPrice;
	uint256 public betFee;
	uint256 public prizePool;
	uint256 public ownerPool;
	bool public betsOpen;
	uint256 public betsClosingTime;

	enum BetOption {
		Argentina,
		Brazil
	} // Heads = Argentina, Tails = Brazil //This is a function to replace heads and tails by Argentina and Brazil

	struct Bet {
		address player;
		BetOption option;
	}

	Bet[] public bets;

	mapping(address => uint256) public prize;

	constructor(
		string memory tokenName,
		string memory tokenSymbol,
		uint256 _purchaseRatio,
		uint256 _betPrice,
		uint256 _betFee
	) Ownable() {
		paymentToken = new LotteryToken(tokenName, tokenSymbol);
		purchaseRatio = _purchaseRatio;
		betPrice = _betPrice;
		betFee = _betFee;
	}

	modifier whenBetsClosed() {
		require(!betsOpen, "Bets are open");
		_;
	}

	modifier whenBetsOpen() {
		require(
			betsOpen && block.timestamp < betsClosingTime,
			"Bets are closed"
		);
		_;
	}

	function openBets(uint256 closingTime) external onlyOwner whenBetsClosed {
		require(
			closingTime > block.timestamp,
			"Closing time must be in the future"
		);
		betsClosingTime = closingTime;
		betsOpen = true;
	}

	function purchaseTokens() external payable {
		paymentToken.mint(msg.sender, msg.value * purchaseRatio);
	}

	function placeBet(BetOption option) public whenBetsOpen {
		require(
			option == BetOption.Argentina || option == BetOption.Brazil,
			"Invalid option"
		);
		ownerPool += betFee;
		prizePool += betPrice;
		bets.push(Bet(msg.sender, option));
		paymentToken.transferFrom(msg.sender, address(this), betPrice + betFee);
	}

	function closeBetsAndDetermineOutcome() external {
		require(block.timestamp >= betsClosingTime, "Too soon to close");
		require(betsOpen, "Bets already closed");

		BetOption outcome = getRandomOutcome();

		for (uint256 i = 0; i < bets.length; i++) {
			if (bets[i].option == outcome) {
				prize[bets[i].player] += prizePool / bets.length;
			}
		}

		prizePool = 0;
		delete bets;
		betsOpen = false;
	}

	function getRandomOutcome() public view returns (BetOption) {
		uint256 randomNumber = block.prevrandao % 2; // Generates a 0 or 1
		return randomNumber == 0 ? BetOption.Argentina : BetOption.Brazil; //Watch this bit, this is basically a coinflip function where   heads=brazil and tails=argentina
	}

	function withdrawPrize(uint256 amount) external {
		require(amount <= prize[msg.sender], "Not enough prize");
		prize[msg.sender] -= amount;
		paymentToken.transfer(msg.sender, amount);
	}

	function ownerWithdraw(uint256 amount) external onlyOwner {
		require(amount <= ownerPool, "Not enough fees collected");
		ownerPool -= amount;
		paymentToken.transfer(msg.sender, amount);
	}

	function returnTokens(uint256 amount) external {
		paymentToken.burnFrom(msg.sender, amount);
		payable(msg.sender).transfer(amount / purchaseRatio);
	}
}
