// user/dtos/user-response.dto.ts

import { ApiProperty } from "@nestjs/swagger"; // Import ApiProperty for Swagger documentation
import { UserRole } from "../../auth/dtos/role.enum";

export class UserResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  id: string;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  updated: Date;

  @ApiProperty()
  deleted: Date | null;
}
