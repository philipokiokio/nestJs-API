import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // moved to the APP Module to be used globally in the application.
  // app.use(cookieSession({
  //   keys:['myoldcarnest']
  // }))

  // Moved this into the appModule to make it available to all request. E2E Testing
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist:true
  //   }),
  // )
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
