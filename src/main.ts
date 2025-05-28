import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // This middleware logs the request method and URL
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

  const origin = process.env.CORS_ORIGIN?.split(',') || '*';

  app.enableCors({
    origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
