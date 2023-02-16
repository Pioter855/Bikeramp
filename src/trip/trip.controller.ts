import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { TripDto } from './dto/trip.dto';
import { TripService } from './trip.service';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}
  @Post()
  @HttpCode(201)
  create(@Body() tripDto: TripDto) {
     this.tripService.create(tripDto);
  }
}
