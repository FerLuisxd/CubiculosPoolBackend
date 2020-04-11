import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './modules/room/room.module';
import { ReservationModule } from './modules/reservation/reservation.module';

require('dotenv').config()
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_SRV,{useNewUrlParser: true,useUnifiedTopology: true}),UserModule, AuthModule,RoomModule,ReservationModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
