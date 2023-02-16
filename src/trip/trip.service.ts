import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from 'typeorm';
import { Trip } from "./trip.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleMapsService } from "../google-maps/google-maps.service";
import { TravelMode } from "@googlemaps/google-maps-services-js";
import { pricePerKm } from "../config/price.config";
import { TripDto } from "./dto/trip.dto";

@Injectable()
export class TripService {

  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly googleMapsService: GoogleMapsService,
  ) {}


  async create({ start, finish }: TripDto) {

    const distance = await this.googleMapsService.getCoordinates({
      origins: [start],
      destinations: [finish],
      mode: TravelMode.bicycling,
    })

    if (!distance) {
      throw new BadRequestException('Distance not found')
    }

    const distanceKm = distance / 1000;
    const price = pricePerKm.price
    const tripPrice = +(distanceKm * price).toFixed(2)


    const trip = await this.tripRepository.create({
      start,
      finish,
      distance: distanceKm,
      pricePerKm:price,
      tripPrice: tripPrice
    });
    if (!trip) {
      throw new NotFoundException('Trip doesnt exist');
    }
    return this.tripRepository.save(trip);
 }
}
