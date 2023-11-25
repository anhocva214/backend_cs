import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { json, urlencoded } from "express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as morgan from "morgan";
import * as fs from "fs";
import * as path from "path";

async function bootstrap() {
  // const logger = new Logger("bootstrap");
  const logger = new Logger("bootstrap");

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "logger.log"),
    { flags: "a" }
  );

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Log Request to __dirname/logger.log

  // app.use(
  //   morgan("combined", {
  //     stream: accessLogStream,
  //   })
  // );

  app.setGlobalPrefix("api/");

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  });
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  const config = new DocumentBuilder()
    .setTitle("MGS-NestJS-API")
    .setDescription("API List for MGSv2 Service")
    .setVersion("1.0")
    .addBearerAuth()
    // .addTag("MGS")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger", app, document, {
    swaggerOptions: {
      tagsSorter: "alpha",
      apisSorter: "alpha",
      operationsSorter: "method",
    },
  });

  await app.listen(process.env.PORT || 3000);

  logger.log(__dirname);
  logger.log(`Environment: ${process.env.NODE_ENV}`);
  logger.log(`CseDeli API Service is running in http://localhost:${process.env.PORT}`);
  logger.log(
    `CseDeli Swagger is running in http://localhost:${process.env.PORT}/api/swagger`
  );
  logger.log(
    `CseDeli GraphQL is running in http://localhost:${process.env.PORT}/graphql`
  );
}
bootstrap();
