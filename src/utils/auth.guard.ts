import { Injectable, CanActivate, ExecutionContext, Inject, Logger, UnauthorizedException, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { messages } from './messages';
import { UserService } from '../modules/user/user.service';
import { JWTvalidate } from './jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    private logger: Logger = new Logger(AuthGuard.name)
  constructor(@Inject("UserService") private readonly userService:UserService ) {}

  async canActivate(context: ExecutionContext) {
      try {
          const request  = context.switchToHttp().getRequest();
          if(!request.headers.authorization){
            this.logger.debug(messages.authMissingError)
            throw new UnauthorizedException(messages.authMissingError)
          }
          const respondeValidate = await this.validateAuthHeader(request.headers.authorization)
          request.userId = respondeValidate.userId
          request.userInSession = respondeValidate.user
          return true

      } catch (error) {
        this.logger.debug(error.stack)
        if(error instanceof HttpException) throw error
        throw new UnauthorizedException(error.message)
      }
  }

  async validateAuthHeader(auth:string){
        const authHeader = auth.split(" ");
        if(authHeader[0] != 'Bearer') throw new Error('Invalid Token')
        if(!authHeader[1]) throw new Error('Invalid Token')
        const id = JWTvalidate(authHeader[1])
        const user = await this.userService.findOne(id,true)
        const valid = user?.token === authHeader[1]
        if(valid){
            return {
                userId: id._id,
                user: user
            }
        }
        else{
            this.logger.debug(`Invalid token for ${id._id}, resenting token`)
            this.userService.updateToken(id,'')
            throw new UnauthorizedException(messages.authMissingError)
        }
  }
}