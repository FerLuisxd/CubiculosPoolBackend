import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Logger
  } from '@nestjs/common';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    logger :Logger
    constructor(){
        this.logger  = new Logger('Exception Filter')
    }
    catch(exception: any, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        
        const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
        
        let description = exception.getResponse?.() ?? exception.message ?? exception
        try {
            description = JSON.parse(description)
        } catch (error) {}
        this.logger.error(exception.stack)
      response.status(status).send({
        description
      });
    }
  }