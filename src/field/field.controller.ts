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

import { FieldService } from "./field.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { UpdateFieldDto } from "./dtos/update-field.dto";

@Controller("field")
@UseGuards(RolesGuard)
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createField")
  async createFieldWithSoilId(@Body() createFieldDto: CreateFieldDto) {
    const createdField = await this.fieldService.createField(createFieldDto);
    return { data: createdField };
  }

  @Get("getAll")
  async getAllFields() {
    const transformedFields = await this.fieldService.findAllFields();
    return { data: transformedFields };
  }

  @Get(":id")
  async getFieldById(@Param("id", ParseUUIDPipe) id: string) {
    const transformedField = await this.fieldService.findById(id);
    return { data: transformedField };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateField(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    const updatedField = await this.fieldService.updateField(
      id,
      updateFieldDto,
    );
    return { data: updatedField };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.fieldService.deleteFieldById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteFieldByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const userRole = UserRole.OWNER;

    return this.fieldService.permanentlyDeleteFieldByIdForOwner(id, userRole);
  }
}
