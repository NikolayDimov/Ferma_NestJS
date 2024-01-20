import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MachineController } from "./machine.controller";
import { MachineService } from "./machine.service";
import { Machine } from "./machine.entity";
import { FarmModule } from "../farm/farm.module";

@Module({
  imports: [TypeOrmModule.forFeature([Machine]), FarmModule],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [TypeOrmModule.forFeature([Machine]), MachineService],
})
export class MachineModule {}
