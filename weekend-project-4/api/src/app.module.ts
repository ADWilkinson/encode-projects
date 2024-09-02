import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MyTokenService } from './myToken.service';
import { TokenizedBallotService } from './tokenizedBallot.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MyTokenService, TokenizedBallotService],
})
export class AppModule {}
