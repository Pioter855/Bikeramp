import { Injectable } from '@nestjs/common';
import { TripService } from '../trip/trip.service';
import * as moment from 'moment';
import { MonthStatisticInterface } from './interface/month-statistic.interface';
import { WeekStatisticInterface } from './interface/week-statistic.interface';

@Injectable()
export class StatisticService {
  constructor(private readonly tripService: TripService) {}

  async weekStatistic()  {
    const [data] = await this.tripService.weekStatistic();
    return {
      totalDistance:`${data.totalDistance} KM`,
      totalPrice: `${data.totalPrice} PLN`
    }
  }

  async monthStatistic() : Promise<{
    day:string,
    totalDistance: string
    avgRide: string,
    avgPrice:string,
  }[]> {
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
