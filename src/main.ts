import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

  const origin = process.env.CORS_ORIGIN?.split(',') || '*';

  if (origin === '*') {
    console.warn(
      'CORS is set to allow all origins. This may expose your API to security risks.',
    );
  } else {
    console.log(`CORS is set to allow origins: ${origin}`);
  }

  app.use(
    cors({
      origin: origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
