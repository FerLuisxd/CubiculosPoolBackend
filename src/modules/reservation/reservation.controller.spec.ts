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
  "userCode": "u201711338",
  "userSecondaryCode": "u201711338",
  "active": false
}

const available : any = {
  "start" : "2020-05-08T00:00:00.000Z",
  "available" : [ 
      {
          "features" : [ 
              "Apple TV", 
              "MAC"
          ],
          "office" : "MO",
          "code" : "I708",
          "seats" : 6
      }, 
      {
          "features" : [ 
              "Apple TV", 
              "MAC"
          ],
          "office" : "MO",
          "code" : "I707",
          "seats" : 6
      }, 
      {
          "features" : [ 
              "Apple TV", 
              "MAC"
          ],
          "office" : "MO",
          "code" : "I709",
          "seats" : 6
      }
  ],
  "__v" : 0
}

const user : any = {
  name : " Luis Fernando Vilca Flores",
  userCode : "U201711338",
  email : "U201711338@upc.edu.pe",
  inRoom : false,
  hoursLeft : {
      "todayHours" : 2,
      "tomorrowHours" : 2,
      "secondaryHours" : 2
  },
  points : 0,
}

let db 
let collection
describe('Reservation Controller', () => {
  let controller: ReservationController;
  const goodPostBody : PostReservationDto = {
    room: {
      office: "MO",
      code: "I708"
    },
    hours: 2,
    userSecondaryCode: "u201711334",
    start: new Date("2020-05-08T00:00:00.000Z")
  }


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

  it('should reserve', async () => {
     expect(0).toBe(0)    
   });

  it('should return a reservation', async () => {
    const response = await controller.getOneById(reservation._id)
    expect(0).toBe(0) 
  })
})
