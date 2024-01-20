import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Farm } from "./farm.entity";
import { UserRole } from "../auth/dtos/role.enum";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { UpdateFarmDto } from "./dtos/update-farm.dto";

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm) private farmRepository: Repository<Farm>,
  ) {}

  async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
    const { name, location } = createFarmDto;

    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2 ||
      !location.coordinates.every((coord) => typeof coord === "number")
    ) {
      throw new Error("Invalid coordinates provided");
    }

    const farm = new Farm();
    farm.name = name;

    // Create a GeoJSON Point object for the location
    const locationObject = {
      type: "Point",
      coordinates: location.coordinates,
    };

    // Serialize the GeoJSON Point to a JSON string
    farm.location = JSON.stringify(locationObject);

    const createdFarm = await this.farmRepository.save(farm);
    return createdFarm;
  }

  async findOne(id: string, options?: { relations?: string[] }): Promise<Farm> {
    if (!id) {
      return null;
    }

    return await this.farmRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async findOneById(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({ where: { id } });
    return farm;
  }

  // transformFarm and transformCountry -- use for findAllWithCountries and findById
  private transformFarm(farm: Farm) {
    return {
      id: farm.id,
      name: farm.name,
      created: farm.created,
      updated: farm.updated,
      deleted: farm.deleted,
      fields: [],
    };
  }

  async findAllFarms() {
    const farms = await this.farmRepository.find({});
    return farms.map((farm) => this.transformFarm(farm));
  }

  // async findAllWithCountries() {
  //   const fields = await this.farmRepository
  //     .createQueryBuilder("farm")
  //     .where("farm.deleted IS NULL")
  //     .getMany();

  //   return fields.map((farm) => this.transformFarm(farm));
  // }

  async findById(id: string) {
    const farm = await this.farmRepository
      .createQueryBuilder("farm")
      .andWhere("farm.id = :id", { id })
      .andWhere("farm.deleted IS NULL")
      .getOne();

    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    return this.transformFarm(farm);
  }

  async updateFarm(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    // console.log("Received ID:", id);
    const existingfarm = await this.farmRepository.findOne({
      where: { id },
    });

    if (updateFarmDto.name) {
      existingfarm.name = updateFarmDto.name;
    }

    const updatedFarmDto = await this.farmRepository.save(existingfarm);

    // console.log("Updated Field:", updatedField);
    return updatedFarmDto;
  }

  async deleteFarm(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingFarm = await this.farmRepository.findOneBy({ id });

    if (!existingFarm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }

    // Soft delete using the softDelete method
    await this.farmRepository.softDelete({ id });

    return {
      id,
      name: existingFarm.name,
      message: `Successfully soft-deleted Farm with id ${id} and name ${existingFarm.name}`,
    };
  }

  async permanentlyDeletefarmByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingFarm = await this.farmRepository.findOneBy({ id });

    if (!existingFarm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }

    // Perform the permanent delete
    await this.farmRepository.remove(existingFarm);

    return {
      id,
      name: existingFarm.name,
      message: `Successfully permanently deleted Farm with id ${id} and name ${existingFarm.name}`,
    };
  }

  // Farm with most machines
  async getFarmsWithMostMachines(): Promise<
    { farmId: string; farmName: string; machineCount: number }[]
  > {
    const result = await this.farmRepository
      .createQueryBuilder("farm")
      .leftJoinAndSelect("farm.machines", "machines")
      .select([
        "farm.id as farmId",
        "farm.name as farmName",
        "CAST(COUNT(DISTINCT machines.id)AS INTEGER) as machineCount",
      ])
      .groupBy("farm.id, farm.name")
      .orderBy("machineCount", "DESC")
      .limit(10)
      .getRawMany();

    return result;
  }

  // Count of fields per farm and crop
  async getFieldsPerFarmAndCrop(): Promise<
    { farmName: string; cropName: string; fieldCount: number }[]
  > {
    const fieldsPerFarmAndCrop = await this.farmRepository
      .createQueryBuilder("farm")
      .leftJoin("farm.fields", "field")
      .leftJoin("field.growingCropPeriods", "growingCropPeriod")
      .leftJoin("growingPeriod.crop", "crop")
      .select([
        "farm.name AS farmName",
        "crop.name AS cropName",
        "CAST(COUNT(DISTINCT field.id)AS INTEGER) AS fieldCount",
      ])
      .groupBy("farm.name, crop.name")
      .getRawMany();

    return fieldsPerFarmAndCrop;
  }
}
