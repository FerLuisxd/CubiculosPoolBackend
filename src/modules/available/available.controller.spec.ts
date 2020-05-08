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

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri()

    const available = await MongoClient.connect(mongoUri)
    db = await available.db()
    collection = db.collection('availables')
    await collection.insert(available)


    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableController],
      providers: [AvailableService, RoomService, UserService],
      imports: [MongooseModule.forRoot(mongoUri, {useNewUrlParser: true,useUnifiedTopology: true}),
        MongooseModule.forFeature([{ name: 'rooms', schema: RoomSchema }]),
        MongooseModule.forFeature([{ name: 'availables', schema: AvailableSchema }]),
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
        AvailableDto,
        RoomModule],
    }).compile();

    availableService = module.get<AvailableService>(AvailableService);
    availableController = module.get<AvailableController>(AvailableController);
    roomService = module.get<RoomService>(RoomService);
    userService = module.get<UserService>(UserService);
  });

  it('should return availables', async () => {
    const response = await availableController.getAll('', '', '' ,'')
    console.log("//////////////////////////////////")
    console.log(response.map.length)
    expect(response.map.length).toBeGreaterThan(0);
    console.log("Termine")
  });
});
