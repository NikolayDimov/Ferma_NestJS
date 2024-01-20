import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { Crop } from "./crop.entity";
import { CreateCropDto } from "./dtos/create-crop.dto";
import { UpdateCropDto } from "./dtos/update-crop.dto";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop) private cropRepository: Repository<Crop>,
  ) {}

  async createCrop(createCropDto: CreateCropDto): Promise<Crop> {
    const errors = await validate(createCropDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name } = createCropDto;

    // Attempt to find the crop by name (including soft-deleted ones)
    const existingCrop = await this.cropRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    if (existingCrop) {
      // If the crop exists and is soft-deleted, restore it
      if (existingCrop.deleted) {
        existingCrop.deleted = null;
        return await this.cropRepository.save(existingCrop);
      } else {
        // If the crop is not soft-deleted, throw a conflict exception
        throw new ConflictException(`Crop ${name} already exists`);
      }
    }

    const newCrop = this.cropRepository.create({ name });
    return await this.cropRepository.save(newCrop);
  }

  async findAll(): Promise<Crop[]> {
    const crop = await this.cropRepository
      .createQueryBuilder("crop")
      .andWhere("crop.deleted IS NULL")
      .getMany();

    if (!crop.length) {
      throw new NotFoundException("No crop found");
    }

    return crop;
  }

  async findByName(name: string): Promise<Crop | undefined> {
    return this.cropRepository
      .createQueryBuilder("crop")
      .where("crop.name = :name", { name })
      .getOne();
  }

  async findOne(id: string): Promise<Crop> {
    const existingCropId = await this.cropRepository.findOneBy({ id });
    return existingCropId;
  }

  async findById(id: string): Promise<Crop> {
    const crop = await this.cropRepository
      .createQueryBuilder("crop")
      .andWhere("crop.id = :id", { id })
      .andWhere("crop.deleted IS NULL")
      .getOne();

    if (!crop) {
      throw new NotFoundException(`Crop with ID ${id} not found`);
    }

    return crop;
  }

  async updateCrop(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.cropRepository.findOneBy({ id });

    if (updateCropDto.name) {
      crop.name = updateCropDto.name;
    }

    return await this.cropRepository.save(crop);
  }

  async deleteCropById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingCrop = await this.cropRepository.findOne({
      where: { id },
      relations: ["growingCropPeriods"],
    });

    if (!existingCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }

    if (
      existingCrop.growingCropPeriods &&
      existingCrop.growingCropPeriods.length > 0
    ) {
      throw new BadRequestException(
        "This crop has associated growingCropPeriods. Cannot be soft deleted.",
      );
    }

    // Soft delete using the softDelete method
    await this.cropRepository.softDelete({ id });

    return {
      id,
      name: existingCrop.name,
      message: `Successfully soft-deleted Farm with id ${id} and name ${existingCrop.name}`,
    };
  }

  async permanentlyDeleteCropByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingCrop = await this.cropRepository.findOne({
      where: { id },
      relations: ["growingCropPeriods"],
    });

    if (!existingCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }

    if (
      existingCrop.growingCropPeriods &&
      existingCrop.growingCropPeriods.length > 0
    ) {
      throw new BadRequestException(
        "This crop has associated growingCropPeriods. Cannot be soft deleted.",
      );
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }

    // Perform the permanent delete
    await this.cropRepository.remove(existingCrop);

    return {
      id,
      name: existingCrop.name,
      message: `Successfully permanently deleted Crop with id ${id} and name ${existingCrop.name}`,
    };
  }
}
