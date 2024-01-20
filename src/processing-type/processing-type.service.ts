import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProcessingType } from "./processing-type.entity";
import { validate } from "class-validator";
import { CreateProcessingTypeDto } from "./dtos/create-processing-type.dto";
// import { UpdateProcessingTypeDto } from "./dtos/update-Processing-type.dto";
// import { ProcessingService } from "../Processing/Processing.service";

@Injectable()
export class ProcessingTypeService {
  constructor(
    @InjectRepository(ProcessingType)
    private processingTypeRepository: Repository<ProcessingType>,
    //private ProcessingService: ProcessingService,
  ) {}

  async createProcessingType(
    createProcessingTypeDto: CreateProcessingTypeDto,
  ): Promise<ProcessingType> {
    const errors = await validate(createProcessingTypeDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name } = createProcessingTypeDto;
    const newProcessingType = this.processingTypeRepository.create({
      name,
    });
    return await this.processingTypeRepository.save(newProcessingType);
  }

  async findOneByName(name: string): Promise<ProcessingType> {
    const ProcessingTypeName = await this.processingTypeRepository.findOne({
      where: { name },
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

  // Better not update Processing-type
  // async updateProcessingType(
  //   id: string,
  //   updateProcessingTypeDto: UpdateProcessingTypeDto,
  // ): Promise<ProcessingType> {
  //   const existingProcessingType =
  //     await this.ProcessingTypeRepository.findOne({
  //       where: { id },
  //       relations: ["Processings"],
  //     });

  //   if (
  //     existingProcessingType.Processings &&
  //     existingProcessingType.Processings.length > 0
  //   ) {
  //     // If there are associated Processings, prevent changing the ProcessingId
  //     if (
  //       updateProcessingTypeDto.ProcessingId &&
  //       updateProcessingTypeDto.ProcessingId !==
  //         existingProcessingType.Processings[0].id
  //     ) {
  //       throw new BadRequestException(
  //         "This Processing type has associated Processings. Cannot update the ProcessingId.",
  //       );
  //     }
  //   }

  //   // Update other fields if provided
  //   if (updateProcessingTypeDto.name !== undefined) {
  //     existingProcessingType.name = updateProcessingTypeDto.name;
  //   }

  //   // If the user provided a ProcessingId, validate and update the Processing
  //   if (updateProcessingTypeDto.ProcessingId) {
  //     const Processing = await this.ProcessingService.findOne(
  //       updateProcessingTypeDto.ProcessingId,
  //     );

  //     if (!Processing) {
  //       throw new BadRequestException(
  //         "No Processing found with the provided ProcessingId",
  //       );
  //     }

  //     existingProcessingType.Processings = [Processing]; // Assign as an array
  //   }

  //   // Save and return the updated Processing type
  //   return await this.ProcessingTypeRepository.save(existingProcessingType);
  // }

  async deleteProcessingTypeById(id: string): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    const existingProcessingType = await this.processingTypeRepository.findOne({
      where: { id },
      relations: ["Processings"],
    });

    if (!existingProcessingType) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    if (
      existingProcessingType.processings &&
      existingProcessingType.processings.length > 0
    ) {
      throw new BadRequestException(
        "This Processing Type has associated Processings. Cannot be soft deleted.",
      );
    }

    // Soft delete using the softDelete method
    await this.processingTypeRepository.softDelete({ id });

    return {
      id,
      name: existingProcessingType.name,
      message: `Successfully permanently deleted Processing type with id ${id}, name ${existingProcessingType.name}`,
    };
  }
}
