import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
//import { validate } from "class-validator";
import { Machine } from "./machine.entity";
import { CreateMachineDto } from "./dtos/create-machine.dto";
import { UpdateMachineDto } from "./dtos/update-machine.dto";
import { UserRole } from "../auth/dtos/role.enum";
import { FarmService } from "../farm/farm.service";

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine) private machineRepository: Repository<Machine>,
    private farmService: FarmService,
  ) {}

  async createMachine(createMachineDto: CreateMachineDto): Promise<Machine> {
    const { brand, model, registerNumber, farmId } = createMachineDto;

    const farm = await this.farmService.findOne(farmId);

    if (!farm) {
      throw new BadRequestException("No machine found");
    }

    const machine = this.machineRepository.create({
      brand,
      model,
      registerNumber,
      farm: farm,
    });

    const createdMachine = await this.machineRepository.save(machine);
    return createdMachine;
  }

  async findOneByName(
    brand: string,
    model: string,
    registerNumber: string,
  ): Promise<Machine> {
    const machineName = await this.machineRepository.findOne({
      where: { brand, model, registerNumber },
    });
    return machineName;
  }

  async findOneById(id: string): Promise<Machine | undefined> {
    // const existingMachine = await this.machineRepository.findOne({
    //   where: { id },
    // });
    const existingMachine = await this.machineRepository.findOneBy({ id });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    return existingMachine;
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<Machine> {
    if (!id) {
      return null;
    }

    return await this.machineRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async findAll(): Promise<Machine[]> {
    const machine = await this.machineRepository
      .createQueryBuilder("machine")
      .leftJoinAndSelect("machine.farm", "farm")
      .andWhere("machine.deleted IS NULL")
      .getMany();

    if (!machine.length) {
      throw new NotFoundException("No machines found");
    }

    return machine;
  }

  async findById(id: string): Promise<Machine> {
    const machine = await this.machineRepository
      .createQueryBuilder("machine")
      .andWhere("machine.id = :id", { id })
      .andWhere("machine.deleted IS NULL")
      .getOne();

    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    return machine;
  }

  // Transfer machine guard to another farm, if machine participate in cultivation
  // Work, and also can update machine brand, model, reg number
  async updateMachine(
    id: string,
    updateMachineDto: UpdateMachineDto,
  ): Promise<Machine> {
    // Fetch the existing machine with associated data
    const machine = await this.machineRepository.findOne({
      where: { id },
      relations: ["cultivations", "farm"],
    });

    // Check if there are associated cultivations
    if (machine.processings && machine.processings.length > 0) {
      // If there are associated cultivations, prevent changing the farmId
      if (
        updateMachineDto.farmId &&
        updateMachineDto.farmId !== machine.farm.id
      ) {
        throw new BadRequestException(
          "This machine has associated cultivations. Cannot update the farm.",
        );
      }
    }

    // Update other fields if provided
    if (updateMachineDto.brand !== undefined) {
      machine.brand = updateMachineDto.brand;
    }

    if (updateMachineDto.model !== undefined) {
      machine.model = updateMachineDto.model;
    }

    if (updateMachineDto.registerNumber !== undefined) {
      machine.registerNumber = updateMachineDto.registerNumber;
    }

    // If the user provided a farmId, validate and update the farm
    if (updateMachineDto.farmId) {
      const farm = await this.farmService.findOne(updateMachineDto.farmId);

      if (!farm) {
        throw new BadRequestException("No farm found with the provided farmId");
      }

      machine.farm = farm;
    }

    // Save and return the updated machine
    return await this.machineRepository.save(machine);
  }

  // Transfer machine guard to another farm, if machine participate in cultivation
  // Work, but also can't update machine brand, model, reg number

  // async updateMachine(
  //   id: string,
  //   updateMachineDto: UpdateMachineDto,
  // ): Promise<Machine> {
  //   const machine = await this.machineRepository.findOne({
  //     where: { id },
  //     relations: ["cultivations", "farm"],
  //   });

  //   if (!machine) {
  //     throw new NotFoundException(`Machine with ID ${id} not found`);
  //   }

  //   if (machine.cultivations && machine.cultivations.length > 0) {
  //     throw new BadRequestException(
  //       "This machine has associated cultivations. Cannot update the farm.",
  //     );
  //   }

  //   if (updateMachineDto.farmId) {
  //     const farm = await this.farmService.findOne(updateMachineDto.farmId);

  //     if (!farm) {
  //       throw new BadRequestException("No farm found with the provided farmId");
  //     }

  //     machine.farm = farm;
  //   }

  //   if (
  //     updateMachineDto.brand ||
  //     updateMachineDto.model ||
  //     updateMachineDto.registerNumber
  //   ) {
  //     if (updateMachineDto.brand) {
  //       machine.brand = updateMachineDto.brand;
  //     }

  //     if (updateMachineDto.model) {
  //       machine.model = updateMachineDto.model;
  //     }

  //     if (updateMachineDto.registerNumber) {
  //       machine.registerNumber = updateMachineDto.registerNumber;
  //     }
  //   }

  //   return await this.machineRepository.save(machine);
  // }

  async deleteMachineById(id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    const existingMachine = await this.machineRepository.findOne({
      where: { id },
      relations: ["cultivations"],
    });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    if (existingMachine.processings && existingMachine.processings.length > 0) {
      throw new BadRequestException(
        "This machine has associated cultivations. Cannot be soft deleted.",
      );
    }

    // Soft delete using the softDelete method
    await this.machineRepository.softDelete({ id });

    return {
      id,
      brand: existingMachine.brand,
      model: existingMachine.model,
      registerNumber: existingMachine.registerNumber,
      message: `Successfully permanently deleted Machine with id ${id}, Brand ${existingMachine.brand}, Model ${existingMachine.model} and Register Number ${existingMachine.registerNumber}`,
    };
  }

  async permanentlyDeleteMachineByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    const existingMachine = await this.machineRepository.findOne({
      where: { id },
      relations: ["cultivations"],
    });
    // console.log("Found machine:", existingMachine);

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }
    // Check if there are associated cultivations
    if (existingMachine.processings && existingMachine.processings.length > 0) {
      throw new BadRequestException(
        "This machine has associated cultivations. Cannot be permanently deleted.",
      );
    }

    // Perform the permanent delete
    await this.machineRepository.remove(existingMachine);

    return {
      id,
      brand: existingMachine.brand,
      model: existingMachine.model,
      registerNumber: existingMachine.registerNumber,
      message: `Successfully permanently deleted Machine with id ${id}, Brand ${existingMachine.brand}, Model ${existingMachine.model} and Register Number ${existingMachine.registerNumber}`,
    };
  }
}
