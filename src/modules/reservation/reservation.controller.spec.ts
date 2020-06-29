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
import { PostReservationDto } from './dto/post.reservation.dto';
import { IsNotEmpty } from 'class-validator';
import { AvailableController } from '../available/available.controller';


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
  "publicFeatures": [],
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
const goodPostBody : any = {
  room: {
    office: "MO",
    code: "I708"
  },
  hours: 1,
  userSecondaryCode: "u201711334",
  start: "2020-05-07T19:00:00-05:00"
}


let db 
let collection
describe('Reservation Controller', () => {
  let controller: ReservationController;
  let controllerAvailable:AvailableController

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
    controllerAvailable = module.get<AvailableController>(AvailableController);
  });

  beforeEach(async () => {
    const mongoUri = await mongoServer.getUri()
    const client = await MongoClient.connect(mongoUri)
    db = await client.db()    

    await db.collection('availables').remove({})
    await db.collection('availables').insertOne(available)

    await db.collection('users').remove({})
    await db.collection('users').insertOne(user)

    collection = db.collection('reservations')
    await collection.remove({})    
    reservation.start = moment().tz("America/Lima").add(10,'hours').set({ minute: 0, second: 0, millisecond: 0 }).toISOString()
    reservation.end = moment().tz("America/Lima").add(12,'hours').set({ minute: 0, second: 0, millisecond: 0 }).toISOString()
    await collection.insertOne(reservation)
  });


  it('should delete a reservation', async () => {
    const response = await controller.cancel(reservation._id,user)
    expect(await collection.findOne({_id:reservation._id})).toBeNull
  });

  it('should reserve', async () => {
    // console.log('response',JSON.stringify(await controllerAvailable.getAll('','','','')))
    const response = await controller.reserve(goodPostBody, user)
   });

  it('should return a reservation', async () => {
    const response :any = await controller.getOneById(reservation._id)
    expect(JSON.parse(JSON.stringify(response))).toStrictEqual(JSON.parse(JSON.stringify(reservation)))
  });
})
