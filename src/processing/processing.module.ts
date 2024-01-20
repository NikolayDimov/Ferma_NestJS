import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProcessingController } from "./processing.controller";
import { Processing } from "./processing.entity";
import { ProcessingTypeModule } from "../processing-type/processing-type.module";
import { MachineModule } from "src/machine/machine.module";
import { GrowingCropPeriodModule } from "../growing-crop-period/growing-crop-period.module";
import { ProcessingService } from "./processing.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Processing]),
    ProcessingTypeModule,
    MachineModule,
    GrowingCropPeriodModule,
  ],
  controllers: [ProcessingController],
  providers: [ProcessingService],
  exports: [TypeOrmModule.forFeature([Processing]), ProcessingService],
})
export class ProcessingModule {}
