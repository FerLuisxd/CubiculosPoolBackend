import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Body, HttpStatus } from '@nestjs/common';
import { AuthDto } from './auth.entity';
import { ApiResponse } from '@nestjs/swagger';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UserSchema } from '../user/user.entity.ts';




describe('Auth Controller',async () => {
  let authController: AuthController;
  let authService: AuthService;

  let goodBody: AuthDto = {userCode: "u201713920",password: "Intranet upc2020"};
  let badBody: AuthDto = {userCode: "u000000000",password: "0000000000"};
  let mongoServer = null

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
    console.log(authController)
  });  



    it('should get token', async () => {
      let response = await authController.loginUserExp2(goodBody)
      expect(response.name).toBeDefined()
      expect(response.token).toBeDefined()
  });
})
