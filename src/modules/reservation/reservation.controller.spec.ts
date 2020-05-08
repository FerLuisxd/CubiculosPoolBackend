import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { AuthController } from '../auth/auth.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { AvailableModule } from '../available/available.module';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ReservationSchema } from './reservation.entity';
import { UserSchema } from '../user/user.entity';
import { RoomSchema } from '../room/room.entity';
import { AvailableSchema } from '../available/available.entity';
import { ReservationService } from './reservation.service';


let mongoServer = null
process.env = {
  JWT_SECRET: 'asdsafasdsafasdsad12321421'
}

describe('Reservation Controller', () => {
  let controller: ReservationController;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [ReservationService, UserService],
      imports: [
        MongooseModule.forRoot(mongoUri,{useNewUrlParser: true,useUnifiedTopology: true}),
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'reservations', schema: ReservationSchema }]),
        MongooseModule.forFeature([{ name: 'rooms', schema: RoomSchema }]),
        MongooseModule.forFeature([{ name: 'availables', schema: AvailableSchema }]),
      UserModule,RoomModule,AvailableModule],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
