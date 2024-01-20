import {
  Controller,
  ValidationPipe,
  Body,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateGrowingCropPeriodDto } from "./dtos/create-growing-crop-period.dto";
import { GrowingCropPeriodService } from "./growing-crop-period.service";
import { GrowingCropPeriod } from "./growing-crop-period.entity";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("growingCropPeriods")
@UseGuards(RolesGuard)
export class GrowingCropPeriodController {
  constructor(private growingCropPeriodService: GrowingCropPeriodService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createGrowingCropPeriod")
  async createGrowingPeriod(
    @Body(ValidationPipe)
    createGrowingCropPeriodDto: CreateGrowingCropPeriodDto,
  ): Promise<GrowingCropPeriod> {
    return this.growingCropPeriodService.createGrowingCropPeriod(
      createGrowingCropPeriodDto,
    );
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; message: string }> {
    return this.growingCropPeriodService.deleteGrowingCropPeriodById(id);
  }
}
