import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
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
    const errors = await validate(createMachineDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { brand, model, registerNumber, farmId } = createMachineDto;

    // Attempt to find the machine by brand, model and regNumber (including soft-deleted ones)
    const existingMachine = await this.machineRepository.findOne({
      withDeleted: true,
      where: { brand, model, registerNumber },
    });

    if (existingMachine) {
      // If the soil exists and is soft-deleted, restore it
      if (existingMachine.deleted) {
        existingMachine.deleted = null;
        return await this.machineRepository.save(existingMachine);
      } else {
        // If the soil is not soft-deleted, throw a conflict exception
        throw new ConflictException(
          `Machine with ${registerNumber} already exists`,
        );
      }
    }

    const farm = await this.farmService.findOne(farmId);

    if (!farm) {
      throw new BadRequestException("No farm found");
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

  // Update machine with Transfer machine guard to another farm, if machine participate in cultivation
  // Work, and also can update machine brand, model, reg number
  async updateMachine(
    id: string,
    updateMachineDto: UpdateMachineDto,
  ): Promise<Machine> {
    // Fetch the existing machine with associated data
    const machine = await this.machineRepository.findOne({
      where: { id },
      relations: ["processings", "farm"],
    });

    // Check if there are associated processing
    if (machine.processings && machine.processings.length > 0) {
      {
        throw new BadRequestException(
          "This machine has associated processing. Cannot update the farm.",
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

  // Tarnsferring machine from one Farm to another
  async transferMachine(id: string, newFarmId: string): Promise<Machine> {
    // Fetch the existing machine with associated data
    const existingMachine = await this.machineRepository.findOne({
      where: { id },
      relations: ["processings", "farm"],
    });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    if (existingMachine.processings && existingMachine.processings.length > 0) {
      throw new BadRequestException(
        "This machine has associated processing. Cannot be transferred.",
      );
    }

    // Validate and update the farm
    const newFarm = await this.farmService.findOne(newFarmId);

    if (!newFarm) {
      throw new BadRequestException("No farm found with the provided farmId");
    }

    existingMachine.farm = newFarm;

    // Save and return the updated machine
    return await this.machineRepository.save(existingMachine);
  }

  async deleteMachineById(id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    const existingMachine = await this.machineRepository.findOne({
      where: { id },
      relations: ["processings"],
    });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    if (existingMachine.processings && existingMachine.processings.length > 0) {
      throw new BadRequestException(
        "This machine has associated processing. Cannot be soft deleted.",
      );
    }

    // Soft delete using the softDelete method
    await this.machineRepository.softDelete({ id });

    return {
      id,
      brand: existingMachine.brand,
      model: existingMachine.model,
      registerNumber: existingMachine.registerNumber,
      message: `Successfully soft deleted Machine with id ${id}, Brand ${existingMachine.brand}, Model ${existingMachine.model} and Register Number ${existingMachine.registerNumber}`,
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
      relations: ["processings"],
    });
    // console.log("Found machine:", existingMachine);

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }
    // Check if there are associated processing
    if (existingMachine.processings && existingMachine.processings.length > 0) {
      throw new BadRequestException(
        "This machine has associated processing. Cannot be permanently deleted.",
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
