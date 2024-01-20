import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

    // Attempt to find the farm by name (including soft-deleted ones)
    const existingFarm = await this.farmRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    if (existingFarm) {
      // If the farm exists and is soft-deleted, restore it
      if (existingFarm.deleted) {
        existingFarm.deleted = null;
        return await this.farmRepository.save(existingFarm);
      } else {
        // If the farm is not soft-deleted, throw a conflict exception
        throw new ConflictException(`Farm with name: ${name} already exists`);
      }
    }

    // Create the farm entity with the correct location
    const farm = this.farmRepository.create({
      name,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
    });

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
    //const existingFarm = await this.farmRepository.findOne({ where: { id } });
    const existingFarm = await this.farmRepository.findOneBy({ id });
    if (!existingFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return existingFarm;
  }

  // transformFarm and transformCountry -- use for findAllWithCountries and findById
  private transformFarm(farm: Farm) {
    return {
      id: farm.id,
      name: farm.name,
      location: farm.location,
      fields: [],
      created: farm.created,
      updated: farm.updated,
      deleted: farm.deleted, // we can remove some property and not shown in response
    };
  }

  async findAllFarms() {
    const farms = await this.farmRepository.find({});
    if (!farms) {
      throw new NotFoundException(`No farms found`);
    }
    return farms.map((farm) => this.transformFarm(farm));
  }

  // async findAllFarms() {
  //   const fields = await this.farmRepository
  //     .createQueryBuilder("farm")
  //     .where("farm.deleted IS NULL")
  //     .getMany();

  //   return fields.map((farm) => this.transformFarm(farm));
  // }

  // We can select what to be in the response
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
