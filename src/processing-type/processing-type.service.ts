import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProcessingType } from "./processing-type.entity";
import { validate } from "class-validator";
import { CreateProcessingTypeDto } from "./dtos/create-processing-type.dto";
import { UserRole } from "../auth/dtos/role.enum";
import { UpdateProcessingTypeDto } from "./dtos/update-prcessing-type.dto";

@Injectable()
export class ProcessingTypeService {
  constructor(
    @InjectRepository(ProcessingType)
    private processingTypeRepository: Repository<ProcessingType>,
  ) {}

  async findAll(): Promise<ProcessingType[]> {
    const processingType = await this.processingTypeRepository
      .createQueryBuilder("processingType")
      .andWhere("processingType.deleted IS NULL")
      .getMany();

    if (!processingType.length) {
      throw new NotFoundException("No processingType found");
    }
    return processingType;
  }

  async findById(id: string): Promise<ProcessingType> {
    const processingType = await this.processingTypeRepository
      .createQueryBuilder("processingType")
      .andWhere("processingType.id = :id", { id })
      .andWhere("processingType.deleted IS NULL")
      .getOne();

    if (!processingType) {
      throw new NotFoundException(`ProcessingType with ID ${id} not found`);
    }
    return processingType;
  }

  async findOneByName(name: string): Promise<ProcessingType> {
    const ProcessingTypeName = await this.processingTypeRepository.findOne({
      where: { name },
      relations: ["processings"],
    });
    return ProcessingTypeName;
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<ProcessingType> {
    if (!id) {
      return null;
    }

    return await this.processingTypeRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async createProcessingType(
    createProcessingTypeDto: CreateProcessingTypeDto,
  ): Promise<ProcessingType> {
    const errors = await validate(createProcessingTypeDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name } = createProcessingTypeDto;

    // Attempt to find the processingType by name (including soft-deleted ones)
    const existingProcessingType = await this.processingTypeRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    if (existingProcessingType) {
      // If the processingType exists and is soft-deleted, restore it
      if (existingProcessingType.deleted) {
        existingProcessingType.deleted = null;
        return await this.processingTypeRepository.save(existingProcessingType);
      } else {
        // If the processingType is not soft-deleted, throw a conflict exception
        throw new ConflictException(`Processing Type ${name} already exists`);
      }
    }

    const newProcessingType = this.processingTypeRepository.create({
      name,
    });
    return await this.processingTypeRepository.save(newProcessingType);
  }

  // Better not update Processing-type
  async updateProcessingType(
    id: string,
    updateProcessingTypeDto: UpdateProcessingTypeDto,
  ): Promise<ProcessingType> {
    const existingProcessingType = await this.processingTypeRepository.findOne({
      where: { id },
      relations: ["processings"],
    });

    if (
      existingProcessingType.processings &&
      existingProcessingType.processings.length > 0
    ) {
      throw new BadRequestException(
        `This Processing Type ${existingProcessingType.name} has associated Processings. Cannot update the Processing Type.`,
      );
    }

    if (updateProcessingTypeDto.name) {
      existingProcessingType.name = updateProcessingTypeDto.name;
    }

    const updatedProcessingType = await this.processingTypeRepository.save(
      existingProcessingType,
    );

    return updatedProcessingType;
  }

  async deleteProcessingTypeById(id: string): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    const existingProcessingType = await this.processingTypeRepository.findOne({
      where: { id },
      relations: ["processings"],
    });

    if (!existingProcessingType) {
      throw new NotFoundException(`Processing Type with id ${id} not found`);
    }

    if (
      existingProcessingType.processings &&
      existingProcessingType.processings.length > 0
    ) {
      throw new BadRequestException(
        `This Processing Type ${existingProcessingType.name} has associated Processings. Cannot be soft deleted.`,
      );
    }

    // Soft delete using the softDelete method
    await this.processingTypeRepository.softDelete({ id });

    return {
      id,
      name: existingProcessingType.name,
      message: `Successfully permanently deleted Processing Type with id ${id}, name ${existingProcessingType.name}`,
    };
  }

  async permanentlyDeleteProcessingTypeForOwner(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingProcessingType = await this.processingTypeRepository.findOne({
      where: { id },
      relations: ["processings"],
    });

    if (!existingProcessingType) {
      throw new NotFoundException(`Processing Type with id ${id} not found`);
    }

    if (
      existingProcessingType.processings &&
      existingProcessingType.processings.length > 0
    ) {
      throw new BadRequestException(
        `This Processing Type ${existingProcessingType.name} has associated Processings. Cannot be permanent deleted.`,
      );
    }

    // Perform the permanent delete
    await this.processingTypeRepository.remove(existingProcessingType);

    return {
      id,
      name: existingProcessingType.name,
      message: `Successfully permanently deleted Processing Type with id ${id}, name ${existingProcessingType.name}`,
    };
  }
}
