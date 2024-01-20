import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
  //Patch,
} from "@nestjs/common";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ProcessingTypeService } from "./processing-type.service";
import { CreateProcessingTypeDto } from "./dtos/create-processing-type.dto";
//import { UpdateCultivationTypeDto } from "./dtos/update-cultivation-type.dto";

@Controller("processingType")
@UseGuards(RolesGuard)
export class ProcessingTypeController {
  constructor(private processingTypeService: ProcessingTypeService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createProcessingType")
  async createProcessing(
    @Body() createProcessingTypeDto: CreateProcessingTypeDto,
  ) {
    return this.processingTypeService.createProcessingType(
      createProcessingTypeDto,
    );
  }

  // @Roles(UserRole.OWNER, UserRole.OPERATOR)
  // @Patch(":id")
  // async updateCultivationType(
  //   @Param("id") id: string,
  //   @Body() updateCultivationTypeDto: UpdateCultivationTypeDto,
  // ) {
  //     return this.cultivationTypeService.updateCultivationType(
  //       id,
  //       updateCultivationTypeDto,
  //     );
  // }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteProcessingById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    return this.processingTypeService.deleteProcessingTypeById(id);
  }
}
