import { Test, TestingModule } from '@nestjs/testing';
import { AvailableController } from './available.controller';
import { AvailableService } from './available.service';
import { AvailableSchema } from './available.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from '../room/room.entity';
import { UserSchema } from '../user/user.entity';
import { RoomModule } from '../room/room.module';
import { RoomService } from '../room/room.service';
import { AvailableDto } from './available.entity';
import { UserService } from '../user/user.service';
import { MongoClient } from 'mongodb';
import { UserModule } from '../user/user.module';

describe('Available Controller', () => {
  let availableController: AvailableController;
  let availableService: AvailableService;
  let roomService: RoomService;
  let userService: UserService;

  let mongoServer = null
    process.env = {
    JWT_SECRET: 'asdsafasdsafasdsad12321421'
  }

  let db
  let collection
  const available = {
    "_id" : "5eacf43cfa07c2c07cb75d59",
    "start" : "2020-05-03T04:00:00.000Z",
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
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableController],
      providers: [AvailableService],
      imports: [
        MongooseModule.forRoot(mongoUri, {useNewUrlParser: true,useUnifiedTopology: true}),
        MongooseModule.forFeature([{ name: 'rooms', schema: RoomSchema }]),
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'availables', schema: AvailableSchema }]),
        UserModule,RoomModule],
    }).compile();

    availableController = module.get<AvailableController>(AvailableController);
  });

  beforeEach(async () => {
    const mongoUri = await mongoServer.getUri()
    const client = await MongoClient.connect(mongoUri)
    db = await client.db()
    collection = db.collection('availables')
    await collection.remove({})
    await collection.insertOne(available)
  });

  it('should return array of availables', async () => {
    const response = await availableController.getAll('', '', '' ,'')
    expect(response).toBeDefined()
    expect(response.length).toBeGreaterThan(0)
  });

  
  it('should return one available', async () => {
    const response = await availableController.getAll('', '', '' ,'')
    expect(response[0].start).not.toBe(available.start)
    response[0].start = undefined
    available.start = undefined
    expect(response[0]).toStrictEqual(available);
  });
});
