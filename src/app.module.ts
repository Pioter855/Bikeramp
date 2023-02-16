import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { TripModule } from './trip/trip.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TripModule,
    GoogleMapsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
