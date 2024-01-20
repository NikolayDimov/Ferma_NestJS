import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SoilController } from "./soil.controller";
import { SoilService } from "./soil.service";
import { Soil } from "./soil.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Soil])],
  controllers: [SoilController],
  providers: [SoilService],
  exports: [TypeOrmModule.forFeature([Soil]), SoilService],
})
export class SoilModule {}
