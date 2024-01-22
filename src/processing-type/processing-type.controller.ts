import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Patch,
} from "@nestjs/common";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ProcessingTypeService } from "./processing-type.service";
import { CreateProcessingTypeDto } from "./dtos/create-processing-type.dto";
import { UpdateProcessingTypeDto } from "./dtos/update-prcessing-type.dto";

@Controller("processingType")
@UseGuards(RolesGuard)
export class ProcessingTypeController {
  constructor(private processingTypeService: ProcessingTypeService) {}

  @Get()
  async getAllProcessingType() {
    return this.processingTypeService.findAll();
  }

  @Get(":id")
  async getCropById(@Param("id", ParseUUIDPipe) id: string) {
    return this.processingTypeService.findById(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createProcessing(
    @Body() createProcessingTypeDto: CreateProcessingTypeDto,
  ) {
    return this.processingTypeService.createProcessingType(
      createProcessingTypeDto,
    );
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateProcessingType(
    @Param("id") id: string,
    @Body() updateProcessingTypeDto: UpdateProcessingTypeDto,
  ) {
    return this.processingTypeService.updateProcessingType(
      id,
      updateProcessingTypeDto,
    );
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteProcessingTypeById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    return this.processingTypeService.deleteProcessingTypeById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteProcessingTypeForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.processingTypeService.permanentlyDeleteProcessingTypeForOwner(
      id,
    );
  }
}
