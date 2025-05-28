import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const allowedOrigin = 'https://task-management-tool-tau.vercel.app';

  app.use(
    cors({
      origin: function (origin, callback) {
        console.log('Incoming Origin:', origin);
        if (origin === allowedOrigin || !origin) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
    }),
  );

  // Middleware to log cookies on each request
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Cookies on request:', req.cookies);
    next();
  });

  await app.listen(process.env.PORT || 3001);
}
void bootstrap();
