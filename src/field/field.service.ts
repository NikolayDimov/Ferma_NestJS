import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Field } from "./field.entity";
import { Soil } from "../soil/soil.entity";
import { Farm } from "../farm/farm.entity";
import { UserRole } from "../auth/dtos/role.enum";
import { SoilService } from "../soil/soil.service";
import { FarmService } from "../farm/farm.service";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { UpdateFieldDto } from "./dtos/update-field.dto";
import { GrowingCropPeriod } from "../growing-crop-period/growing-crop-period.entity";
import { Crop } from "../crop/crop.entity";

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field) private fieldRepository: Repository<Field>,
    private soilService: SoilService,
    private farmService: FarmService,
  ) {}

  async createField(createFieldDto: CreateFieldDto): Promise<Field> {
    const { name, boundary, soilId, farmId } = createFieldDto;

    const existingField = await this.fieldRepository.findOne({
      withDeleted: true,
      where: { name, farm: { id: farmId } },
    });

    if (existingField) {
      if (existingField.deleted) {
        existingField.deleted = null;
        return await this.fieldRepository.save(existingField);
      } else {
        const farm = await this.farmService.findOneById(farmId);
        const errorMessage = `Field with name: '${name}' already exists in farm: '${farm ? farm.name : "Unknown farm"}'`;
        throw new ConflictException(errorMessage);
      }
    }

    let farm: Farm;
    const existingFieldInOtherFarms = await this.fieldRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    const soil = await this.soilService.findOne(soilId);
    if (!soil) {
      throw new BadRequestException(`No soil found`);
    }

    farm = await this.farmService.findOneById(farmId);
    if (!farm) {
      throw new BadRequestException(`No farm with ${farm.id}`);
    }

    const field = this.fieldRepository.create({
      name,
      boundary,
      soil,
      farm,
    });

    const createdField = await this.fieldRepository.save(field);
    return createdField;
  }

  // transformField and transformSoil -- use for findAllWithSoil and findById
  private transformField(field: Field): Field {
    return {
      id: field.id,
      name: field.name,
      boundary: field.boundary,
      created: field.created,
      updated: field.updated,
      deleted: field.deleted,
      soil: field.soil ? this.transformSoil(field.soil) : null,
      farm: field.farm,
      growingCropPeriods: field.growingCropPeriods,
    };
  }

  //The transformSoil function allows selectively include or exclude certain properties of the Soil entity in the transformed output.
  private transformSoil(soil: Soil): Soil {
    return {
      id: soil.id,
      name: soil.name,
      created: soil.created,
      updated: soil.updated,
      deleted: soil.deleted,
      fields: soil.fields || [],
    };
  }

  async findAllFields() {
    const fields = await this.fieldRepository
      .createQueryBuilder("field")
      .leftJoinAndSelect("field.soil", "soil")
      .leftJoinAndSelect("field.farm", "farm")
      .where("field.deleted IS NULL")
      .getMany();

    return fields.map((field) => this.transformField(field));
  }

  async findOne(id: string): Promise<Field> {
    const existingFieldId = await this.fieldRepository.findOneBy({ id });
    return existingFieldId;
  }

  async findOneById(id: string): Promise<Field> {
    const existingField = await this.fieldRepository.findOne({ where: { id } });
    return existingField;
  }

  async findById(id: string): Promise<Field> {
    const field = await this.fieldRepository
      .createQueryBuilder("field")
      .leftJoinAndSelect("field.soil", "soil")
      .leftJoinAndSelect("field.farm", "farm")
      .andWhere("field.id = :id", { id })
      .andWhere("field.deleted IS NULL")
      .getOne();

    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }

    return this.transformField(field);
  }

  async updateField(
    id: string,
    updateFieldDto: UpdateFieldDto,
  ): Promise<Field> {
    // console.log("Received ID:", id);
    const existingField = await this.fieldRepository.findOne({
      where: { id },
      relations: ["soil", "growingCropPeriods"],
    });

    if (!existingField) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }

    // Check if the field is associated with any GrowingCropPeriods
    if (
      existingField.growingCropPeriods &&
      existingField.growingCropPeriods.length > 0
    ) {
      throw new BadRequestException(
        `This field ${existingField.name} has associated GrowingCropPeriods. Cannot update the farm.`,
      );
    }

    if (updateFieldDto.soilId) {
      let newSoil = await this.soilService.findOne(updateFieldDto.soilId);

      existingField.soil = newSoil;
    }

    if (updateFieldDto.farmId) {
      let newFarm = await this.farmService.findOne(updateFieldDto.farmId);

      existingField.farm = newFarm;
    }

    if (updateFieldDto.name !== undefined) {
      existingField.name = updateFieldDto.name;
    }

    if (updateFieldDto.boundary) {
      existingField.boundary = updateFieldDto.boundary;
    }

    const updatedField = await this.fieldRepository.save(existingField);

    // console.log("Updated Field:", updatedField);
    return updatedField;
  }

  async deleteFieldById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingField = await this.fieldRepository.findOne({
      where: { id },
      relations: ["soil", "growingCropPeriods"],
    });

    if (!existingField) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }

    if (
      existingField.growingCropPeriods &&
      existingField.growingCropPeriods.length > 0
    ) {
      throw new BadRequestException(
        `This field ${existingField.name} has associated growingCropPeriods. Cannot be soft deleted.`,
      );
    }

    // Soft delete using the softDelete method
    await this.fieldRepository.softDelete({ id });

    return {
      id,
      name: existingField.name,
      message: `Successfully soft-deleted Field with id ${id} and name ${existingField.name}`,
    };
  }

  async permanentlyDeleteFieldByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingField = await this.fieldRepository.findOne({
      where: { id },
      relations: ["soil", "growingCropPeriods"],
    });

    if (!existingField) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }

    if (
      existingField.growingCropPeriods &&
      existingField.growingCropPeriods.length > 0
    ) {
      throw new BadRequestException(
        `This field ${existingField.name} has associated growingCropPeriods. Cannot be permanent deleted.`,
      );
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }
    await this.fieldRepository.remove(existingField);
    return {
      id,
      name: existingField.name,
      message: `Successfully permanently deleted Field with id ${id} and name ${existingField.name}`, // TODO - leave id only
    };
  }

  async getFieldsPerFarmAndCrop(): Promise<
    {
      cropId: string;
      cropName: string;
      farmId: string;
      farmName: string;
      fieldCount: number;
    }[]
  > {
    const fieldsPerFarmAndCrop = await this.fieldRepository
      .createQueryBuilder("field")
      .select([
        "farm.id AS farmId",
        "farm.name AS farmName",
        "crop.id AS cropId",
        "crop.name AS cropName",
        "CAST(COUNT(field.id)AS INTEGER) AS fieldCount",
      ])
      .innerJoin(Farm, "farm", "field.farm_id = farm.id")
      .innerJoin(
        GrowingCropPeriod,
        "growingCropPeriod",
        "field.id = growingCropPeriod.field_id",
      )
      .innerJoin(Crop, "crop", "crop.id = growingCropPeriod.crop_id")
      .groupBy("farm.id, crop.id")
      .orderBy("fieldCount", "DESC")
      .getRawMany();

    return fieldsPerFarmAndCrop;
  }

  async getMostCommonSoilPerFarm(): Promise<
    {
      soilId: string;
      soilName: string;
      farmId: string;
      farmName: string;
      fieldCount: number;
    }[]
  > {
    const fieldsPerFarmAndSoil = await this.fieldRepository
      .createQueryBuilder("field")
      .select([
        "farm.id AS farm",
        "farm.name AS farmName",
        "soil.id AS soil",
        "soil.name AS soilName",
        "CAST(COUNT(field.id) AS INTEGER) AS soilTypeCount",
      ])
      .innerJoin("field.soil", "soil")
      .innerJoin("field.farm", "farm")
      .groupBy("farm.id, soil.id")
      .orderBy("soilTypeCount", "DESC")
      .getRawMany();

    return fieldsPerFarmAndSoil;
  }
}
