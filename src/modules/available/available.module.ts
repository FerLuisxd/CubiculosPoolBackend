import { Module } from '@nestjs/common';
import { AvailableController } from './available.controller';
import { AvailableService } from './available.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailableSchema } from './available.entity';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'availables', schema: AvailableSchema }]),UserModule,RoomModule],
  controllers: [AvailableController],
  providers: [AvailableService]
})
export class AvailableModule {}
