import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { TravelMode } from '@googlemaps/google-maps-services-js';
import { tripConfig } from '../config/trip.config';
import { TripDto } from './dto/trip.dto';
import { MonthStatisticInterface } from '../statistic/interface/month-statistic.interface';
import { WeekStatisticInterface } from '../statistic/interface/week-statistic.interface';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async create({ start, finish }: TripDto): Promise<void> {
    const distance = await this.googleMapsService.getCoordinates({
      origins: [start],
      destinations: [finish],
      mode: TravelMode.bicycling,
    });

    if (!distance) {
      throw new BadRequestException('One of two locations not found');
    }

    const distanceKm = distance / 1000;
    const pricePerKm = tripConfig.pricePerKm;
    const tripPrice = +((distanceKm * pricePerKm) / 100).toFixed(2);

    const trip = await this.tripRepository.create({
      start,
      finish,
      distance: distanceKm,
      pricePerKm,
      tripPrice,
    });

    if (!trip) {
      throw new NotFoundException(`Trip doesn't exist`);
    }

    await this.tripRepository.save(trip);
  }

  weekStatistic(): Promise<WeekStatisticInterface[]> {
    return this.tripRepository
      .createQueryBuilder('trip')
      .select('SUM("distance")', 'totalDistance')
      .addSelect('SUM("tripPrice")', 'totalPrice')
      .where(
        `"createAt" between date_trunc('week', now()) and date_trunc('week', now())+ interval '6 days'`,
      )
      .execute();
  }

  monthStatistic(): Promise<MonthStatisticInterface[]> {
    return this.tripRepository
      .createQueryBuilder('trip')
      .select(`cast("createAt" as date)`, 'day')
      .addSelect('SUM("distance")', 'totalDistance')
      .addSelect(`round(AVG("distance"),2)`, 'avgRide')
      .addSelect(`round(AVG("tripPrice"),2)`, 'avgPrice')
      .where(
        `"createAt" between date_trunc('month', now()) and date_trunc('month', now())+ interval '1 month'`,
      )
      .groupBy('day')
      .execute();
  }
}
