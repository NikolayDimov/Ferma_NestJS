import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProcessingTypeController } from "./processing-type.controller";
import { ProcessingTypeService } from "./processing-type.service";
import { ProcessingType } from "./processing-type.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProcessingType])],
  controllers: [ProcessingTypeController],
  providers: [ProcessingTypeService],
  exports: [TypeOrmModule.forFeature([ProcessingType]), ProcessingTypeService],
})
export class ProcessingTypeModule {}
