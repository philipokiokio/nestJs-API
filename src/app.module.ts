import { MiddlewareConsumer, Module,ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
const cookieSession= require('cookie-session');



@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),

    TypeOrmModule.forRoot()
  ,UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({

        whitelist:true
      })
    }
  ],
})
export class AppModule {
  constructor(private configSerivce: ConfigService){}



  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieSession({
      keys:[this.configSerivce.get('COOKIE_KEY')]
    })).forRoutes("*")
  }
}
