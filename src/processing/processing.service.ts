import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Processing } from "./processing.entity";
import { CreateProcessingDto } from "./dtos/create-processing.dto";
import { UpdateProcessingDto } from "./dtos/update-processing.dto";
import { GrowingCropPeriodService } from "../growing-crop-period/growing-crop-period.service";
import { ProcessingTypeService } from "../processing-type/processing-type.service";
import { MachineService } from "../machine/machine.service";
import { ProcessingType } from "../processing-type/processing-type.entity";
import { GrowingCropPeriod } from "../growing-crop-period/growing-crop-period.entity";
import { Machine } from "../machine/machine.entity";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class ProcessingService {
  constructor(
    @InjectRepository(Processing)
    private processingRepository: Repository<Processing>,
    private growingCropPeriodService: GrowingCropPeriodService,
    private processingTypeService: ProcessingTypeService,
    private machineService: MachineService,
  ) {}

  async createProcessing(
    createProcessingDto: CreateProcessingDto,
  ): Promise<Processing> {
    const { date, processingTypeId, machineId, growingCropPeriodId } =
      createProcessingDto;

    const growingCropPeriod = await this.growingCropPeriodService.findOne(
      growingCropPeriodId,
      { relations: ["field", "field.farm"] },
    );
    if (!growingCropPeriod) {
      throw new BadRequestException(`There is no growingCropPeriod`);
    }

    const processingType =
      await this.processingTypeService.findOne(processingTypeId);
    if (!processingTypeId) {
      throw new BadRequestException(`There is no processingType`);
    }

    const machine = await this.machineService.findOne(machineId, {
      relations: ["farm"],
    });
    if (!machine) {
      throw new BadRequestException(`There is no machine type`);
    }
    console.log("machine:", machine);
    console.log("growingPeriod:", growingCropPeriod);
    // console.log(cultivationType);

    if (machine.farm.id !== growingCropPeriod.field.farm.id) {
      throw new BadRequestException(
        `The machine ${machine.brand} ${machine.model} ${machine.registerNumber} not belong to farm ${growingCropPeriod.field.farm.name}`,
      );
    }

    // Create the processing and associate it with the growingCropperiod, processingType and machine
    const processing = this.processingRepository.create({
      date,
      growingCropPeriod,
      processingType,
      machine,
    });

    const createdProcessing = await this.processingRepository.save(processing);

    // Return the created cultivation
    return createdProcessing;
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<Processing> {
    if (!id) {
      return null;
    }

    return await this.processingRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  // transformField and transformSoil -- use for findAllWithSoil and findById
  private transformProcessing(processingObj: Processing) {
    return {
      id: processingObj.id,
      date: processingObj.date,
      growingCropPeriod: processingObj.growingCropPeriod,
      machine: processingObj.machine,
      processingType: processingObj.processingType,
      created: processingObj.created,
      updated: processingObj.updated,
      deleted: processingObj.deleted,
    };
  }

  async findAllProcessings() {
    const processings = await this.processingRepository
      .createQueryBuilder("processing")
      .leftJoinAndSelect("processing.growingCropPeriod", "growingCropPeriod")
      .leftJoinAndSelect("processing.machine", "machine")
      .leftJoinAndSelect("processing.processingType", "processingType")
      .where("processing.deleted IS NULL")
      .getMany();

    if (!processings.length) {
      throw new NotFoundException("No processings found");
    }

    return processings.map((processing) =>
      this.transformProcessing(processing),
    );
  }

  async findById(id: string): Promise<Processing> {
    const processing = await this.processingRepository
      .createQueryBuilder("processing")
      .leftJoinAndSelect("processing.growingCropPeriod", "growingCropPeriod")
      .leftJoinAndSelect("processing.machine", "machine")
      .leftJoinAndSelect("processing.processingType", "processingType")
      .andWhere("processing.id = :id", { id })
      .andWhere("processing.deleted IS NULL")
      .getOne();

    if (!processing) {
      throw new NotFoundException(`Processing with ID ${id} not found`);
    }
    return this.transformProcessing(processing);
  }

  async updateProcessing(
    id: string,
    updateProcessingDto: UpdateProcessingDto,
  ): Promise<Processing> {
    const existingProcessing = await this.processingRepository.findOne({
      where: { id },
      relations: [
        "growingCropPeriod",
        "growingCropPeriod.field",
        "growingCropPeriod.field.farm",
        "growingCropPeriod.crop",
        "processingType",
        "machine",
        "machine.farm",
      ],
    });

    if (!existingProcessing) {
      throw new NotFoundException(`Processing with ID ${id} not found`);
    }

    if (updateProcessingDto.date) {
      existingProcessing.date = updateProcessingDto.date;
    }

    if (updateProcessingDto.growingCropPeriodId) {
      const growingCropPeriodId = await this.growingCropPeriodService.findOne(
        updateProcessingDto.growingCropPeriodId,
        { relations: ["field", "field.farm"] },
      );
      if (!growingCropPeriodId) {
        throw new BadRequestException("No growingCropPeriodId found");
      }
      existingProcessing.growingCropPeriod = growingCropPeriodId;
    }

    if (updateProcessingDto.processingTypeId) {
      const processingTypeId = await this.processingTypeService.findOne(
        updateProcessingDto.processingTypeId,
      );
      if (!processingTypeId) {
        throw new BadRequestException("No processingTypeId found");
      }
      existingProcessing.processingType = processingTypeId;
    }

    if (updateProcessingDto.machineId) {
      const machineId = await this.machineService.findOne(
        updateProcessingDto.machineId,
        { relations: ["farm"] },
      );

      if (!machineId) {
        throw new BadRequestException("No machineId found");
      }

      const machinefarm = machineId.farm.id;
      const gpFieldfarm = existingProcessing.growingCropPeriod.field.farm.id;

      if (machinefarm !== gpFieldfarm) {
        throw new BadRequestException(
          `Machine ${machineId.brand} ${machineId.model} ${machineId.registerNumber} is not in the same farm as field ${existingProcessing.growingCropPeriod.field.name} is.`,
        );
      }

      existingProcessing.machine = machineId;
    }

    const updatedProcessing =
      await this.processingRepository.save(existingProcessing);
    return updatedProcessing;
  }

  async deleteProcessingById(id: string): Promise<{
    id: string;
    date: Date;
    growingCropPeriod: GrowingCropPeriod[];
    processingType: ProcessingType[];
    machine: Machine[];
    message: string;
  }> {
    const existingProcessing = await this.processingRepository.findOne({
      where: { id },
      relations: ["growingCropPeriod", "processingType", "machine"],
    });

    if (!existingProcessing) {
      throw new NotFoundException(`Processing with id ${id} not found`);
    }

    const growingCropPeriod: GrowingCropPeriod[] =
      (existingProcessing.growingCropPeriod ?? []) as GrowingCropPeriod[];
    const processingType: ProcessingType[] =
      (existingProcessing.processingType ?? []) as ProcessingType[];
    const machine: Machine[] = (existingProcessing.machine ?? []) as Machine[];

    // Soft delete using the softDelete method
    await this.processingRepository.softDelete({ id });

    return {
      id,
      date: existingProcessing.deleted || new Date(), // Use deleted instead of date
      growingCropPeriod,
      processingType,
      machine,
      message: `Successfully soft deleted Processing with id ${id}`,
    };
  }

  async permanentlyDeleteProcessingForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{
    id: string;
    date: Date;
    growingCropPeriod: GrowingCropPeriod[];
    processingType: ProcessingType[];
    machine: Machine[];
    message: string;
  }> {
    const existingProcessing = await this.processingRepository.findOne({
      where: { id },
      relations: ["growingCropPeriod", "processingType", "machine"],
    });
    // console.log("Found machine:", existingMachine);

    if (!existingProcessing) {
      throw new NotFoundException(`Processing with id ${id} not found`);
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }
    const growingCropPeriod: GrowingCropPeriod[] =
      (existingProcessing.growingCropPeriod ?? []) as GrowingCropPeriod[];
    const processingType: ProcessingType[] =
      (existingProcessing.processingType ?? []) as ProcessingType[];
    const machine: Machine[] = (existingProcessing.machine ?? []) as Machine[];

    // Perform the permanent delete
    await this.processingRepository.remove(existingProcessing);

    return {
      id,
      date: existingProcessing.deleted || new Date(), // Use deleted instead of date
      growingCropPeriod,
      processingType,
      machine,
      message: `Successfully permanently deleted Processing with id ${id}`,
    };
  }

  // Most common field soil type (texture) per farm
  async getMostCommonFieldSoilTypePerFarm(): Promise<
    {
      farmName: string;
      mostCommonSoilType: string;
      soilName: string;
      occurrences: number;
    }[]
  > {
    const result = await this.processingRepository
      .createQueryBuilder("processing")
      .select("farm.name", "farmName")
      .addSelect("field.soil", "mostCommonSoilType")
      .addSelect("soil.name", "soilName")
      .addSelect("CAST(COUNT(soil.id)AS INTEGER)", "occurrences")
      .leftJoin("processing.growingCropPeriod", "growingCropPeriod")
      .leftJoin("growingCropPeriod.field", "field")
      .leftJoin("field.farm", "farm")
      .leftJoin("field.soil", "soil")
      .groupBy("farm.name, field.soil, soil.name")
      .orderBy("occurrences", "DESC")
      .getRawMany();

    return result;
  }

  async generateProcessingReport(): Promise<ProcessingReportDTO[]> {
    const result: ProcessingReportDTO[] = await this.processingRepository
      .createQueryBuilder("processing")
      .select([
        "processing.date AS processingDate",
        "processingType.name AS processingTypeName",
        "field.name AS fieldName",
        "machine.brand AS machineBrand",
        "machine.model AS machineModel",
        "crop.name AS cropName",
        "soil.name AS soilName",
        "farm.name AS farmName",
      ])
      .leftJoin("processing.growingCropPeriod", "growingCropPeriod")
      .leftJoin("processing.processingType", "processingType")
      .leftJoin("growingCropPeriod.field", "field")
      .leftJoin("field.soil", "soil")
      .leftJoin("field.farm", "farm")
      .leftJoin("processing.machine", "machine")
      .leftJoin("growingCropPeriod.crop", "crop")
      .where("processing.deleted_at IS NULL")
      .orderBy("processing.date", "ASC")
      .getRawMany();

    return result;
  }
}
