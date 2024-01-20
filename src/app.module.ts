import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { FarmModule } from "./farm/farm.module";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/guards/auth.guard";
import { FieldModule } from "./field/field.module";
import { SoilModule } from "./soil/soil.module";
import { MachineModule } from "./machine/machine.module";
import { CropModule } from "./crop/crop.module";
import { HttpExceptionFilter } from "./filters/HttpExceptionFilter";
import { ReportModule } from "./report/report.module";
import { dataSourceOptions } from "db/data-source";
import { Farm } from "./farm/farm.entity";
import { User } from "./user/user.entity";
import { Field } from "./field/field.entity";
import { Soil } from "./soil/soil.entity";
import { Machine } from "./machine/machine.entity";
import { Crop } from "./crop/crop.entity";
import { GrowingCropPeriod } from "./growing-crop-period/growing-crop-period.entity";
import { Processing } from "./processing/processing.entity";
import { ProcessingType } from "./processing-type/processing-type.entity";
import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    // ConfigModule.forRoot(),
    // TypeOrmModule.forRoot(dataSourceOptions),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: config.get<string>("USERNAME"),
          password: config.get<string>("PASSWORD"),
          database: config.get<string>("DB_NAME"),
          entities: [
            User,
            Farm,
            Field,
            Soil,
            Machine,
            Crop,
            GrowingCropPeriod,
            Processing,
            ProcessingType,
          ],
          synchronize: true,
        };
      },
    }),

    AuthModule,
    UserModule,
    FarmModule,
    FieldModule,
    SoilModule,
    MachineModule,
    CropModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
