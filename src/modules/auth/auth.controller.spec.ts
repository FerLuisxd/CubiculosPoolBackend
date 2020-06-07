import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthDto } from './auth.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UserSchema } from '../user/user.entity';


let mongoServer = null
process.env = {
  JWT_SECRET: 'asdsafasdsafasdsad12321421'
}
jest.setTimeout(10000)
describe('Auth Controller',() => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

  const goodBody: AuthDto = {userCode: "u201713920",password: "Intranet upc2020"};
  const badBody: AuthDto = {userCode: "u000000000",password: "0000000000"};

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService],
      imports: [MongooseModule.forRoot(mongoUri,{useNewUrlParser: true,useUnifiedTopology: true}),
        MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
        UserModule],
    }).compile();
    
    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
  });  



    it('should get token when a good body is sent', async () => {
      const response = await authController.loginUserExp2(goodBody)
      expect(response.name).toBeDefined()
      expect(response.token).toBeDefined()
  })

})
