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
import { RoomService } from '../room/room.service';
import { AvailableService } from '../available/available.service';


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
  "active": false
}
const user :any = {
  name: ' Rodrigo Alfonso Lozano Campos',
  userCode: 'U201713920',
  email: 'U201713920@upc.edu.pe',
  inRoom: false,
  hoursLeft: { todayHours: 2, tomorrowHours: 2, secondaryHours: 2 },
  points: 0,
  __v: 0,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI0YzJjZWExMTU3NTlkNDQ0MzlmYzIiLCJpYXQiOjE1ODg5MDQ2NTQsImV4cCI6MTU5NjY4MDY1NH0.K9Dm0k7DTcwMJ8Oo9NJylSfN5vOu-T4qOsaXe74G8H4'
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
      providers: [ReservationService, UserService,RoomService,AvailableService],
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
    await db.collection('users').insertOne(user)
    await collection.remove({})
    reservation.start = moment().tz("America/Lima").add(10,'hours').set({ minute: 0, second: 0, millisecond: 0 }).toISOString()
    reservation.end = moment().tz("America/Lima").add(12,'hours').set({ minute: 0, second: 0, millisecond: 0 }).toISOString()
    await collection.insertOne(reservation)
  });


  it('should delete a reservation', async () => {
    const response = await controller.cancel(reservation._id,user._id)
    expect(await collection.findOne({_id:reservation._id})).toBeNull
  });
});
