import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as crypto from 'crypto';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the dotenv config from the app
  const configService = app.get(ConfigService);

  require('@google-cloud/profiler').start({
    projectId: 'tuk-dev',
    serviceContext: {
      service: 'your-service',
      version: '1.0.0',
    },
  });

  // Setup validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // add exposed fields and remove excluded fields from entities
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // allow global CORS
  app.enableCors();

  // allow cookies
  app.use(cookieParser());

  // Set up swagger (OpenAPI frontend API browser)
  const nonce = crypto.randomBytes(16).toString('base64');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TrigpointingUK API')
    .setDescription('The API for TrigpointingUK, used by the new SPA website')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl:
              `${configService.get<string>('AUTH0_ISSUER_URL')}authorize` +
              `?audience=${configService.get<string>('AUTH0_AUDIENCE')}` +
              `&nonce=${nonce}`,
            tokenUrl: `${configService.get<string>(
              'AUTH0_ISSUER_URL',
            )}oauth/token`,
            scopes: {
              'create:trigs': 'Create Trigpoint records',
              'create:users': 'Create User records',
              'openid profile email': 'Include email address',
            },
          },
        },
      },
      'oauth2',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerOptions = {
    customSiteTitle: 'TUK API',
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: configService.get<string>('AUTH0_REDIRECT_URL'),
      oauth: {
        clientId: configService.get<string>('AUTH0_CLIENT_ID'),
      },
    },
  };

  SwaggerModule.setup('docs', app, swaggerDocument, swaggerOptions);

  // Start the app
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
