import { Injectable } from '@nestjs/common';
import { TripService } from '../trip/trip.service';
import * as moment from 'moment';
import { MonthStatisticInterface } from './interface/month-statistic.interface';
import { WeekStatisticInterface } from './interface/week-statistic.interface';

@Injectable()
export class StatisticService {
  constructor(private readonly tripService: TripService) {}

  async weekStatistic() : Promise<{}> {
    const data = await this.tripService.weekStatistic();
    return data.map((oneWeekStat: WeekStatisticInterface) => {
      return {
        totalDistance: `${oneWeekStat.totalDistance} KM`,
        totalPrice: `${oneWeekStat.totalPrice} PLN`,
      };
    });
  }

  async monthStatistic(): Promise<{}> {
    const data = await this.tripService.monthStatistic();
    return data.map((oneDayStat: MonthStatisticInterface) => {
      return {
        day: moment(oneDayStat.day).format('MMM, Do'),
        totalDistance: `${oneDayStat.totalDistance} KM`,
        avgRide: `${oneDayStat.avgRide} KM`,
        avgPrice: `${oneDayStat.avgPrice} PLN`,
      };
    });
  }
}
