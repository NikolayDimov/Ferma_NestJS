import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GrowingCropPeriod } from "./growing-crop-period.entity";
import { CreateGrowingCropPeriodDto } from "./dtos/create-growing-crop-period.dto";
import { FieldService } from "../field/field.service";
import { CropService } from "../crop/crop.service";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class GrowingCropPeriodService {
  constructor(
    @InjectRepository(GrowingCropPeriod)
    private growingCropPeriodRepository: Repository<GrowingCropPeriod>,
    private fieldService: FieldService,
    private cropService: CropService,
  ) {}

  async createGrowingCropPeriod(
    createGrowingCropPeriodDto?: Partial<CreateGrowingCropPeriodDto>,
  ): Promise<GrowingCropPeriod> {
    createGrowingCropPeriodDto = createGrowingCropPeriodDto || {};

    const { fieldId, cropId } = createGrowingCropPeriodDto;

    if (!fieldId || !cropId) {
      throw new Error(
        "fieldId and cropId are required in createGrowingPeriodDto",
      );
    }

    const field = await this.fieldService.findOneById(fieldId);
    const crop = await this.cropService.findOne(cropId);

    if (!field || !crop) {
      const notFoundEntity = !field
        ? `Field with id ${fieldId}`
        : `Crop with id ${cropId}`;
      throw new NotFoundException(`${notFoundEntity} not found`);
    }

    const growingPeriod = this.growingCropPeriodRepository.create({
      field,
      crop,
    });

    return this.growingCropPeriodRepository.save(growingPeriod);
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<GrowingCropPeriod> {
    if (!id) {
      return null;
    }

    return await this.growingCropPeriodRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async findOneById(id: string): Promise<GrowingCropPeriod> {
    const existingField = await this.growingCropPeriodRepository.findOne({
      where: { id },
    });
    return existingField;
  }

  async deleteGrowingCropPeriodById(id: string): Promise<{
    id: string;
    message: string;
  }> {
    const existingGrowingPeriod =
      await this.growingCropPeriodRepository.findOne({
        where: { id },
        relations: ["processings"],
      });

    if (!existingGrowingPeriod) {
      throw new NotFoundException(`Growing Period with id ${id} not found`);
    }

    if (
      existingGrowingPeriod.processings &&
      existingGrowingPeriod.processings.length > 0
    ) {
      throw new BadRequestException(
        "This existingGrowingPeriod has associated processing. Cannot be soft deleted.",
      );
    }

    // Soft delete using the softDelete method
    await this.growingCropPeriodRepository.softDelete({ id });

    return {
      id,
      message: `Successfully soft deleted Growing period with id ${id}`,
    };
  }

  async permanentlyDeleteGrowingCropPeriodForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; message: string }> {
    const existingGrowingPeriod =
      await this.growingCropPeriodRepository.findOne({
        where: { id },
        relations: ["processings"],
      });

    if (!existingGrowingPeriod) {
      throw new NotFoundException(`GrowingPeriod with id ${id} not found`);
    }

    if (
      existingGrowingPeriod.processings &&
      existingGrowingPeriod.processings.length > 0
    ) {
      throw new BadRequestException(
        "This existingGrowingPeriod has associated processing. Cannot be soft deleted.",
      );
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }

    // Perform the permanent delete
    await this.growingCropPeriodRepository.remove(existingGrowingPeriod);

    return {
      id,
      message: `Successfully permanently deleted growingCropPeriod with id ${id}`,
    };
  }
}
