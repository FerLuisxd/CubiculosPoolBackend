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
import {MongoClient}  from 'mongodb'
import * as moment from 'moment-timezone'


let mongoServer = null
process.env = {
  JWT_SECRET: 'asdsafasdsafasdsad12321421'
}
const reservation :any =  {
  "room": {
    "office": "MO",
    "code": "I708",
    "building": "I",
    "seats": 6,
    "floor": 7,
    "features": [
      "Mac",
      "Board"
    ]
  },
  "seats": [
    {
      "name": "Luis",
      "features": []
    }
  ],
  "userCode": "u201711333",
  "userSecondaryCode": "u201711334",
  "start": "2020-07-14T00:00:00.000Z",
  "end": "2020-07-14T02:00:00.000Z",
  "active": false
}
let db 
let collection
describe('Reservation Controller', () => {
  let controller: ReservationController;

  beforeAll(async () => {
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

  beforeEach(async () => {
    const mongoUri = await mongoServer.getUri()
    const client = await MongoClient.connect(mongoUri)
    db = await client.db()
    collection = db.collection('reservations')
    await collection.remove({})
    // reservation.start = 
    await collection.insert(reservation)
  });


  it('should delete a reservation', () => {


    // const response = await controller.getUserById(user._id,'')
  });
});
