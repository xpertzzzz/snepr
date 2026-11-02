import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("SneprAPI");
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "https://snepr.in",
      "http://localhost:3000",
      "http://localhost:5173",
      "capacitor://localhost",
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("Snepr Platform Core API")
    .setDescription(
      "Authoritative NestJS REST & Realtime API for Snepr Salon Ecosystem (Bhubaneswar, Odisha). Skip the wait."
    )
    .setVersion("3.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Snepr API server running on http://localhost:${port}`);
  logger.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();

