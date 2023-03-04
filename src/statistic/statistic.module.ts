import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../trip/trip.entity';
import { TripModule } from '../trip/trip.module';
import { TripService } from '../trip/trip.service';

@Module({
  imports: [TripModule],
  providers: [StatisticService],
  controllers: [StatisticController],
})
export class StatisticModule {}
