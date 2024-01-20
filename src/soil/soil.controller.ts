import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateSoilDto } from "./dtos/create-soil.dto";
import { SoilService } from "./soil.service";
import { UpdateSoilDto } from "./dtos/update-soil.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("soil")
@UseGuards(RolesGuard)
export class SoilController {
  constructor(private soilService: SoilService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createSoil")
  async createSoil(@Body() createSoilDto: CreateSoilDto) {
    return this.soilService.createSoil(createSoilDto);
  }

  @Get("getAll")
  async getAllSoils() {
    const soils = await this.soilService.findAll();
    return { data: soils };
  }

  @Get(":id")
  async getSoilById(@Param("id", ParseUUIDPipe) id: string) {
    const soil = await this.soilService.findById(id);
    if (!soil) {
      throw new NotFoundException("Soil not found");
    }
    return { data: soil };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateSoil(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateSoilDto: UpdateSoilDto,
  ) {
    return this.soilService.updateSoil(id, updateSoilDto);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteSoilById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.soilService.deleteSoilById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteCountryByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const userRole = UserRole.OWNER;

    return this.soilService.permanentlyDeleteSoilByIdForOwner(id, userRole);
  }
}

// When you use return with a promise inside an asynchronous function, the function automatically returns a promise that will be resolved with the value returned from the asynchronous operation. Here's the corrected explanation:
