import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MyTokenService } from './myToken.service';
import { MintTokenDto } from './dtos/mintToken.dto';
import { TokenizedBallotService } from './tokenizedBallot.service';

@Controller()
export class AppController {
  constructor(
    private readonly tokenService: MyTokenService,
    private readonly tokenizedBallotService: TokenizedBallotService,
  ) {}
  @Get('contract-address')
  getContractAddress() {
    return { result: this.tokenService.getContractAddress() };
  }

  @Get('total-supply')
  async getTotalSupply() {
    return { result: await this.tokenService.getTotalSupply() };
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: string) {
    return { result: await this.tokenService.getTokenBalance(address) };
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return { result: await this.tokenService.getTransactionReceipt(hash) };
  }

  @Get('server-wallet-address')
  async getServerWalletAddress() {
    return { result: await this.tokenService.getServerWalletAddress() };
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return { result: await this.tokenService.checkMinterRole(address) };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    return {
      result: await this.tokenService.mintTokens(body.address, body.amount),
    };
  }

  @Post('vote')
  async vote(@Body() body: { proposal: number; amount: number }) {
    return {
      result: await this.tokenizedBallotService.vote(
        body.proposal,
        body.amount,
      ),
    };
  }

  @Get('voting-power/:address')
  async getVotingPower(@Param('address') address: string) {
    return {
      result: await this.tokenizedBallotService.getVotingPower(address),
    };
  }

  @Get('winning-proposal')
  async getWinningProposal() {
    return { result: await this.tokenizedBallotService.winningProposal() };
  }

  @Get('winner-name')
  async getWinnerName() {
    return { result: await this.tokenizedBallotService.winnerName() };
  }
}
