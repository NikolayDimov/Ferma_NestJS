import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FieldController } from "./field.controller";
import { FieldService } from "./field.service";
import { Field } from "./field.entity";
import { SoilModule } from "../soil/soil.module";
import { FarmModule } from "../farm/farm.module";

@Module({
  imports: [TypeOrmModule.forFeature([Field]), SoilModule, FarmModule],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [TypeOrmModule.forFeature([Field]), FieldService],
})
export class FieldModule {}
