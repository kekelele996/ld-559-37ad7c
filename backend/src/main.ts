import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ErrorHandlerFilter } from './middleware/error-handler';
import { AuditLogInterceptor } from './middleware/audit-log';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ErrorHandlerFilter());
  app.useGlobalInterceptors(new AuditLogInterceptor(app.get('Reflector'), app.get(PrismaService)));
  await app.get(PrismaService).enableShutdownHooks(app);
  await app.listen(Number(process.env.PORT || 38506), '0.0.0.0');
}

void bootstrap();
