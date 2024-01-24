// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for all routes
  app.enableCors({
    origin: "http://localhost:5173", // Replace with your React app's URL
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
