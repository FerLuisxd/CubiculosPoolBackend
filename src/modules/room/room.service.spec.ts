import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { RoomController } from './room.controller';
import { RoomSchema } from './room.entity';
import { UserSchema } from '../user/user.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {MongoClient}  from 'mongodb'



let mongoServer = null
process.env = {
  JWT_SECRET: 'asdsafasdsafasdsad12321421'
}
let db 
let collection
const room :any = {
  features: { 0:'Apple TV', 1:'MAC' },
  office: 'MO',
  code: 'I708',
  building: 'I',
  seats: 6,
  floor: 7,
  __v: 0
}


describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer()
    const mongooseOpts = {useNewUrlParser: true,useUnifiedTopology: true}
    const mongoUri = await mongoServer.getUri()

    const client = await MongoClient.connect(mongoUri)
    db = await client.db()
    collection = db.collection('rooms')
    await collection.insert(room)


    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [RoomService, UserService],
      imports: [MongooseModule.forRoot(mongoUri,mongooseOpts),
        MongooseModule.forFeature([{ name: 'rooms', schema: RoomSchema }]),
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])],
    }).compile();
    
    service = module.get<RoomService>(RoomService);
  });

  it('should get one room', async () => {
    const response = await service.getOneById(room._id)
    expect(response.office).toBe(room.office)
    expect(response.code).toBe(room.code)
    expect(response.building).toBe(room.building)
  });

  it('should get all rooms', async () => {
    const response = await service.getAll()
    expect(response.length).toBeGreaterThan(0)
  });
});
