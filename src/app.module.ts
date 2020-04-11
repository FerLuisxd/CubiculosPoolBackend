import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

require('dotenv').config()
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_SRV,{useNewUrlParser: true,useUnifiedTopology: true}),UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
