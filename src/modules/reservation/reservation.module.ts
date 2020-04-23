import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema } from './reservation.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'reservations', schema: ReservationSchema }])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
