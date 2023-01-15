import { Injectable, NotFoundException } from '@nestjs/common';
import { TripDto } from './dto/trip.dto';
import { Repository } from 'typeorm';
import { Trip } from "./trip.entity";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TripService {

  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}
  async create({ start, finish }: TripDto) {
    const trip = await this.tripRepository.create({ start, finish });
    if (!trip) {
      throw new NotFoundException('Trip doesnt exist');
    }
    return this.tripRepository.save(trip);
  }
}
