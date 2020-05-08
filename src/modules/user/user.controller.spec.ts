import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserSchema } from './user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UserService } from './user.service';
import {MongoClient}  from 'mongodb'

let mongoServer = null
process.env = {
  JWT_SECRET: 'asdsafasdsafasdsad12321421'
}
let db 
let collection
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

describe('User Controller', () => {
  let controller: UserController;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer()
    const mongooseOpts = {useNewUrlParser: true,useUnifiedTopology: true}
    const mongoUri = await mongoServer.getUri()

    const client = await MongoClient.connect(mongoUri)
    db = await client.db()
    collection = db.collection('users')
    await collection.insert(user)
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
      imports: [MongooseModule.forRoot(mongoUri,mongooseOpts),
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])],
    }).compile();

    controller = module.get<UserController>(UserController);
  });  

  it('should get one users', async () => {
    const response = await controller.getUserById(user._id,'')
    expect(response.name).toBe(user.name)
    expect(response.userCode).toBe(user.userCode)
    expect(response.email).toBe(user.email)
  });
});
