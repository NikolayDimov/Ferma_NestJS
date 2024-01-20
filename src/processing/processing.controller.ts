import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateProcessingDto } from "./dtos/create-processing.dto";
import { UpdateProcessingDto } from "./dtos/update-processing.dto";
import { ProcessingService } from "./processing.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { ProcessingType } from "../processing-type/processing-type.entity";
import { GrowingCropPeriod } from "../growing-crop-period/growing-crop-period.entity";
import { Machine } from "../machine/machine.entity";

@Controller("processing")
@UseGuards(RolesGuard)
export class ProcessingController {
  constructor(private processingService: ProcessingService) {}

  // Cteare Cultivation with growing_period, cultivation_type and machine. If there is no created Attributes - create new cultivation_type and machine. If there is a existing Attributes - select from existing cultivation_type and machine. Growing_period is UUID and always must be created
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createProcessing")
  async createProcessing(@Body() createProcessingDto: CreateProcessingDto) {
    const createdProcessing =
      await this.processingService.createProcessing(createProcessingDto);
    return { data: createdProcessing };
  }

  @Get("getAll")
  async getAllFields() {
    const transformedProcessing =
      await this.processingService.findAllWithAttributes();
    return { data: transformedProcessing };
  }

  @Get(":id")
  async getProcessingById(@Param("id", ParseUUIDPipe) id: string) {
    const transformedField = await this.processingService.findById(id);
    return { data: transformedField };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateField(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProcessingDto: UpdateProcessingDto,
  ) {
    const updatedProcessing = await this.processingService.updateProcessing(
      id,
      updateProcessingDto,
    );
    return { data: updatedProcessing };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    date: Date;
    growingCropPeriod: GrowingCropPeriod[];
    processingType: ProcessingType[];
    machine: Machine[];
    message: string;
  }> {
    return this.processingService.deleteProcessingById(id);
  }
}
