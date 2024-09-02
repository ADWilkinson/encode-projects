import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { mainnet } from 'viem/chains';
import * as ballotJson from './assets/TokenizedBallot.json';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class TokenizedBallotService {
  client;
  walletClient;
  contractAddress: string;

  constructor(private configService: ConfigService) {
    const account = privateKeyToAccount(
      `0x${this.configService.get<string>('PRIVATE_KEY')}`,
    );

    this.client = createPublicClient({
      chain: mainnet,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
    });

    this.contractAddress = this.configService.get<string>(
      'TOKENIZED_BALLOT_ADDRESS',
    ) as `0x${string}`;

    this.walletClient = createWalletClient({
      chain: mainnet,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
      account: account,
    });
  }

  async vote(proposal: number, amount: number) {
    const tx = await this.walletClient.writeContract({
      address: this.contractAddress as `0x${string}`,
      abi: ballotJson.abi,
      functionName: 'vote',
      args: [proposal, amount],
    });

    return tx;
  }

  async getVotingPower(address: string) {
    return this.client.readContract({
      address: this.contractAddress as `0x${string}`,
      abi: ballotJson.abi,
      functionName: 'getVotingPower',
      args: [address],
    });
  }

  async winningProposal() {
    return this.client.readContract({
      address: this.contractAddress,
      abi: ballotJson.abi,
      functionName: 'winningProposal',
    });
  }

  async winnerName() {
    return this.client.readContract({
      address: this.contractAddress,
      abi: ballotJson.abi,
      functionName: 'winnerName',
    });
  }
}
