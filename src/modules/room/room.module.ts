import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './room.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'rooms', schema: RoomSchema }])],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
