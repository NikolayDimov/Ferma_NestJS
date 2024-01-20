import {
  Controller,
  UseGuards,
  Post,
  Patch,
  Body,
  Param,
  Get,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { FarmService } from "./farm.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { UpdateFarmDto } from "./dtos/update-farm.dto";

@Controller("farm")
@UseGuards(RolesGuard)
export class FarmController {
  constructor(private farmService: FarmService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("")
  async createFarm(@Body() createFarmDto: CreateFarmDto) {
    console.log("Received request payload:", createFarmDto);

    const createdFarm = await this.farmService.createFarm(createFarmDto);
    return { data: createdFarm };
  }

  @Get("")
  async getAllFarms() {
    const transformedFarms = await this.farmService.findAllFarms();
    return { data: transformedFarms };
  }

  @Get(":id")
  async getFarmById(@Param("id", ParseUUIDPipe) id: string) {
    const transformedFarm = await this.farmService.findOneById(id);
    return { data: transformedFarm };
  }

  // Update Farm with CountryID
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateFarm(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ) {
    const updatedFarm = await this.farmService.updateFarm(id, updateFarmDto);
    return { data: updatedFarm };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFarm(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.farmService.deleteFarm(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeletefarmByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const userRole = UserRole.OWNER;

    return this.farmService.permanentlyDeletefarmByIdForOwner(id, userRole);
  }
}
