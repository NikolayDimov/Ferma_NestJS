import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateMachineDto } from "./dtos/create-machine.dto";
import { MachineService } from "./machine.service";
import { UpdateMachineDto } from "./dtos/update-machine.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { Machine } from "./machine.entity";

@Controller("machine")
@UseGuards(RolesGuard)
export class MachineController {
  constructor(private machineService: MachineService) {}

  @Get()
  async getAllMachines() {
    const machines = await this.machineService.findAll();
    return { data: machines };
  }

  @Get(":id")
  async getMachineById(@Param("id", ParseUUIDPipe) id: string) {
    const machine = await this.machineService.findOneById(id);
    if (!machine) {
      throw new NotFoundException("Machine not found");
    }

    return { data: machine };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createMachine(@Body() createMachineDto: CreateMachineDto) {
    return this.machineService.createMachine(createMachineDto);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateMachine(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    return this.machineService.updateMachine(id, updateMachineDto);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id/transfer")
  async transferMachine(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("newFarmId", ParseUUIDPipe) newFarmId: string,
  ): Promise<Machine> {
    return this.machineService.transferMachine(id, newFarmId);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteMachineById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    return this.machineService.deleteMachineById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteMachineByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    return this.machineService.permanentlyDeleteMachineByIdForOwner(id);
  }
}

// When you use return with a promise inside an asynchronous function, the function automatically returns a promise that will be resolved with the value returned from the asynchronous operation. Here's the corrected explanation:
