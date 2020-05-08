import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema } from './reservation.entity';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { AvailableModule } from '../available/available.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'reservations', schema: ReservationSchema }]),UserModule,RoomModule,AvailableModule],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
