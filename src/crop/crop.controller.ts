import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CropService } from "./crop.service";
import { CreateCropDto } from "./dtos/create-crop.dto";
import { UpdateCropDto } from "./dtos/update-crop.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("crop")
@UseGuards(RolesGuard)
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createCrop(@Body() createCropDto: CreateCropDto) {
    return this.cropService.createCrop(createCropDto);
  }

  @Get()
  async getAllCrops() {
    return this.cropService.findAll();
  }

  @Get(":id")
  async getCropById(@Param("id", ParseUUIDPipe) id: string) {
    return this.cropService.findById(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateCrop(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCropDto: UpdateCropDto,
  ) {
    return this.cropService.updateCrop(id, updateCropDto);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteCropById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.cropService.deleteCropById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteCropByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const userRole = UserRole.OWNER;

    return this.cropService.permanentlyDeleteCropByIdForOwner(id, userRole);
  }
}
