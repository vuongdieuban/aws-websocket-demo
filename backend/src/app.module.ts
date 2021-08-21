import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionEntity } from './database/entities/Transaction.entity';
import { EventsPublisher } from './events-publisher';
import { EventsGateway } from './events.gateway';
import { typeormConfigOptions } from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfigOptions), TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [AppController],
  providers: [AppService, EventsGateway, EventsPublisher],
})
export class AppModule {}
